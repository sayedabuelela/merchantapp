import { useApi } from "@/src/core/api/clients.hooks";
import {
    GlobalOnboardingData,
} from "@/src/modules/onboarding/data/onboarding-data.model";
import { getOnboardingAllData } from "@/src/modules/onboarding/data/onboarding-data.service";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { AxiosProgressEvent } from "axios";
import { Route, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { selectUser, useAuthStore } from "../../auth/auth.store";
import { accountTypeSelector, useOnboardingStore } from "../onboarding.store";
import { transformFileContentResponse } from "./documents.helper";
import { BusinessLogoMetadata, DocumentViewModelProps, FileUploadApiResponse, Document as OnboardingDocumentMetadata, PickedFile, UploadProgressState } from "./documents.model";
import { getDocumentFileData as getFileContentService, submitDocumentsApi, uploadDocumentFileApi } from "./documents.service";
import { useDocumentsStore } from "./documents.store";

const useDocumentViewModel = ({ documentType }: DocumentViewModelProps) => {

    const router = useRouter();
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const queryClient = useQueryClient();
    const merchantId = user?.merchantId;
    const addOrUpdateDocument = useDocumentsStore(state => state.addOrUpdateDocument);
    const accountType = useOnboardingStore(accountTypeSelector);
    const documents = useDocumentsStore(state => state.documents);
    const [uploadProgress, setUploadProgress] = useState<UploadProgressState | null>(null);
    const onboardingDataQueryKey = ['onboarding-data', merchantId];

    const { data: onboardingData, isLoading: isLoadingOnboardingData } = useQuery<GlobalOnboardingData>({
        queryKey: onboardingDataQueryKey,
        queryFn: () => getOnboardingAllData(api, merchantId!),
        enabled: !!merchantId,
        staleTime: 5 * 60 * 1000,
    });

    let currentFileKey: string | undefined | null = null;
    let existingFileMetadata: OnboardingDocumentMetadata | BusinessLogoMetadata | null = null;

    if (documentType === "businessLogo") {
        existingFileMetadata = onboardingData?.merchant?.merchantInfo?.businessLogo || null;
        currentFileKey = existingFileMetadata?.key;
    } else {
        existingFileMetadata = onboardingData?.merchant?.merchantInfo?.documents?.find(
            (doc) => doc.documentType === documentType && !doc.isDeleted
        ) || null;
        currentFileKey = existingFileMetadata?.key;
    }

    const {
        data: displayableFileData,
        isLoading: isLoadingDocument,
        error: fileContentError,
        refetch: refetchFileContent,
    }: UseQueryResult<ReturnType<typeof transformFileContentResponse>, Error> = useQuery({
        queryKey: ['displayableFile', currentFileKey],
        queryFn: async () => {
            if (!currentFileKey) return null;
            const rawResponse = await getFileContentService(api, `fileKeys[]=${currentFileKey}`);
            return transformFileContentResponse(rawResponse);
        },
        enabled: !!currentFileKey,
        staleTime: 24 * 60 * 60 * 1000,
    });

    const handleUploadProgress = useCallback((progressEvent: AxiosProgressEvent, size: number) => {
        const total = progressEvent.total || size;
        const loaded = progressEvent.loaded;
        const percentage = total > 0 ? Math.round((loaded * 100) / total) : 0;
        setUploadProgress({
            loaded,
            total,
            percentage,
            status: 'uploading',
        });
    }, []);

    const uploadDocumentMutation = useMutation<
        FileUploadApiResponse,
        Error,
        { pickedFile: PickedFile }
    >({
        mutationFn: async ({ pickedFile }) => {
            setUploadProgress({
                loaded: 0,
                total: pickedFile.size || 0,
                percentage: 0,
                status: 'uploading',
            });
            return await uploadDocumentFileApi(api, merchantId!, documentType, pickedFile,
                (progressEvent: AxiosProgressEvent) => handleUploadProgress(progressEvent, pickedFile.size || 0)
            )
        },
        onError: (error, variables) => {
            console.error(`Error uploading ${documentType}:`, error.message);
            setUploadProgress({
                loaded: 0,
                total: variables.pickedFile.size || 0,
                percentage: 0,
                status: 'error',
                error: error.message,
            });
        },
    });


    const submitDocumentsMutation = useMutation<
        FileUploadApiResponse,
        Error
    >({
        mutationFn: async () => {
            return await submitDocumentsApi(api, merchantId!, {
                merchantInfo: {
                    merchantAccountType: accountType!,
                    documents,
                },
            });
        },
        onError: (error, variables) => {
            console.error(`Error uploading ${documentType}:`, error.message);
        },
    });

    const handleUploadDocumentStep = useCallback(async (file: PickedFile | null, navigateTo: Route) => {
        try {
            if (file) {
                await uploadDocumentMutation.mutateAsync({ pickedFile: file }, {
                    onSuccess: async (data, variables) => {
                        const key = data?.body?.imageTitle;
                        if (key) {
                            addOrUpdateDocument({
                                key,
                                documentType,
                                isDeleted: false,
                                isReviewd: false,
                            });

                            if (documentType === 'others') {
                                await submitOnboardingStep(navigateTo);
                            } else {
                                router.push(navigateTo);
                            }
                        } else {
                            setUploadProgress({
                                loaded: variables.pickedFile.size || 0,
                                total: variables.pickedFile.size || 0,
                                percentage: 0,
                                status: 'error',
                                error: 'Upload succeeded but no file key was returned.',
                            });
                        }
                    }
                });
            } else {
                if (documentType === 'others') {
                    await submitOnboardingStep(navigateTo);
                } else {
                    router.push(navigateTo);
                }
            }
        } catch (error) {
            console.error("Final document submission error:", error);
        }
    }, [uploadDocumentMutation.mutateAsync, addOrUpdateDocument, router]);


    const submitOnboardingStep = useCallback(async (navigateTo: Route) => {
        try {
            await submitDocumentsMutation.mutateAsync();
            router.push(navigateTo);
        } catch (error) {
            console.error("Error submitting onboarding step:", error);
        }
    }, [submitDocumentsMutation.mutateAsync, router]);

    return {
        existingFileMetadata,
        currentFileKey,

        displayableFileUri: displayableFileData?.dataUri,
        rawFileObject: displayableFileData?.rawFileObject,
        isLoadingDocument,
        fileContentError,
        refetchFileContent,

        isLoadingGlobalData: isLoadingOnboardingData && !onboardingData,

        uploadDocument: uploadDocumentMutation.mutate,
        uploadDocumentAsync: uploadDocumentMutation.mutateAsync,
        isUploading: uploadDocumentMutation.isPending,
        uploadError: uploadDocumentMutation.error,
        uploadSuccess: uploadDocumentMutation.isSuccess,
        handleUploadDocumentStep,
        uploadProgress,
        submitDocuments: submitDocumentsMutation.mutateAsync,
        submitDocumentsIsPending: submitDocumentsMutation.isPending,
        submitDocumentsError: submitDocumentsMutation.error,
        submitDocumentsSuccess: submitDocumentsMutation.isSuccess,
    };
};

export default useDocumentViewModel;
