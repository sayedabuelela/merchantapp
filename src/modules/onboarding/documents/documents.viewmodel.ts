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
import { useToast } from "@/src/core/providers/ToastProvider";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
    const { showToast } = useToast?.() ?? { showToast: () => { } };

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
        onSuccess: () => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: onboardingDataQueryKey });
            queryClient.invalidateQueries({ queryKey: ['displayableFile'] });
            showToast({
                message: 'Document uploaded successfully',
                type: 'success',
            });
        },
        onError: (error, variables) => {
            console.error(`Error uploading ${documentType}:`, error.message);
            showToast({
                message: `Upload failed: ${error.message}`,
                type: 'danger',
            });
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
        onSuccess: () => {
            // Invalidate queries to refresh data after submission
            queryClient.invalidateQueries({ queryKey: onboardingDataQueryKey });
            showToast({
                message: 'Documents submitted successfully',
                type: 'success',
            });
        },
        onError: (error) => {
            console.error(`Error submitting documents:`, error.message);
            showToast({
                message: `Submission failed: ${error.message}`,
                type: 'danger',
            });
        },
    });

    const handleUploadDocumentStep = useCallback(async (file: PickedFile | null, navigateTo: Route) => {
        try {
            if (file) {
                // Validate file size before upload
                if (file.size && file.size > MAX_FILE_SIZE) {
                    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                    showToast({
                        message: `File size (${fileSizeInMB}MB) exceeds the maximum limit of 5MB`,
                        type: 'danger',
                    });
                    setUploadProgress({
                        loaded: 0,
                        total: file.size,
                        percentage: 0,
                        status: 'error',
                        error: `File size exceeds 5MB limit`,
                    });
                    return;
                }

                const uploadResult = await uploadDocumentMutation.mutateAsync({ pickedFile: file });
                const key = uploadResult?.body?.imageTitle;

                if (key) {
                    // Update store and wait for it to propagate
                    addOrUpdateDocument({
                        key,
                        documentType,
                        isDeleted: false,
                        isReviewd: false,
                    });

                    // For 'others' document (final step), use the updated documents array directly
                    if (documentType === 'others') {
                        // Get fresh documents state after update
                        const updatedDocuments = useDocumentsStore.getState().documents;
                        await submitOnboardingStep(navigateTo, updatedDocuments);
                    } else {
                        router.push(navigateTo);
                    }
                } else {
                    showToast({
                        message: 'Upload succeeded but no file key was returned',
                        type: 'danger',
                    });
                    setUploadProgress({
                        loaded: file.size || 0,
                        total: file.size || 0,
                        percentage: 0,
                        status: 'error',
                        error: 'Upload succeeded but no file key was returned.',
                    });
                }
            } else {
                if (documentType === 'others') {
                    await submitOnboardingStep(navigateTo);
                } else {
                    router.push(navigateTo);
                }
            }
        } catch (error) {
            console.error("Final document submission error:", error);
            showToast({
                message: 'Failed to upload document. Please try again.',
                type: 'danger',
            });
        }
    }, [uploadDocumentMutation.mutateAsync, addOrUpdateDocument, documentType, router, showToast]);


    const submitOnboardingStep = useCallback(async (navigateTo: Route, _documentsToSubmit?: OnboardingDocumentMetadata[]) => {
        try {
            // If specific documents provided, ensure they're used; otherwise use current store state
            // The mutation already reads from the documents state, but we ensure it's fresh
            await submitDocumentsMutation.mutateAsync();
            router.push(navigateTo);
        } catch (error) {
            console.error("Error submitting onboarding step:", error);
            showToast({
                message: 'Failed to submit documents. Please try again.',
                type: 'danger',
            });
        }
    }, [submitDocumentsMutation.mutateAsync, router, showToast]);

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
