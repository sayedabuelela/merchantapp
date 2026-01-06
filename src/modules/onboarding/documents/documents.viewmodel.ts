import { useApi } from "@/src/core/api/clients.hooks";
import {
    GlobalOnboardingData,
} from "@/src/modules/onboarding/data/onboarding-data.model";
import { getOnboardingAllData } from "@/src/modules/onboarding/data/onboarding-data.service";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { AxiosProgressEvent } from "axios";
import { Route, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from 'sonner-native';
import { selectUser, useAuthStore } from "../../auth/auth.store";
import { accountTypeSelector, useOnboardingStore } from "../onboarding.store";
import { transformFileContentResponse } from "./documents.helper";
import { BusinessLogoMetadata, DocumentViewModelProps, FileUploadApiResponse, Document as OnboardingDocumentMetadata, PickedFile, UploadProgressState } from "./documents.model";
import { getDocumentFileData as getFileContentService, submitDocumentsApi, uploadDocumentFileApi } from "./documents.service";
import { useDocumentsStore } from "./documents.store";
import useApprovalBasedSubmit from "../hooks/useApprovalBasedSubmit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const useDocumentViewModel = ({ documentType }: DocumentViewModelProps) => {

    const router = useRouter();
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const queryClient = useQueryClient();
    const merchantId = user?.merchantId;
    const addOrUpdateDocument = useDocumentsStore(state => state.addOrUpdateDocument);
    const accountType = useOnboardingStore(accountTypeSelector);
    const setPendingDocuments = useOnboardingStore((state) => state.setPendingDocuments);
    const documents = useDocumentsStore(state => state.documents);
    const [uploadProgress, setUploadProgress] = useState<UploadProgressState | null>(null);
    const onboardingDataQueryKey = ['onboarding-data', merchantId];
    const { t } = useTranslation();
    const { shouldSaveLocally, canPartialSubmit } = useApprovalBasedSubmit();
    const { data: onboardingData, isLoading: isLoadingOnboardingData } = useQuery<GlobalOnboardingData>({
        queryKey: onboardingDataQueryKey,
        queryFn: () => getOnboardingAllData(api),
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
            toast.success(t('Successful Upload'), {
                richColors: true,
                style: {
                    // backgroundColor: '#F3FFF4',
                    borderWidth: 0
                },
                description: t('Document uploaded successfully'),
            });
        },
        onError: (error, variables) => {
            console.error(`Error uploading ${documentType}:`, error.message);
            toast.error(t('Failed Upload'), {
                richColors: true,
                style: {
                    // backgroundColor: '#F3FFF4',
                    borderWidth: 0
                },
                description: t(`Upload failed: ${error.message}`),
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
            toast.success(t('Successful Upload'), {
                richColors: true,
                style: {
                    // backgroundColor: '#F3FFF4',
                    borderWidth: 0
                },
                description: t('Document uploaded successfully'),
            });
        },
        onError: (error) => {
            console.error(`Error submitting documents:`, error.message);
            toast.error(t('Failed Upload'), {
                richColors: true,
                style: {
                    // backgroundColor: '#F3FFF4',
                    borderWidth: 0
                },
                description: t(`Upload failed: ${error.message}`),
            });
        },
    });

    const handleUploadDocumentStep = useCallback(async (file: PickedFile | null, navigateTo: Route) => {
        try {
            if (file) {
                // Validate file size before upload
                if (file.size && file.size > MAX_FILE_SIZE) {
                    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                    toast.error(t('Failed Upload'), {
                        richColors: true,
                        style: {
                            borderWidth: 0
                        },
                        description: t(`File size (${fileSizeInMB}MB) exceeds the maximum limit of 5MB`),
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

                // File uploads always go to API (need the key)
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

                    // For 'others' document (final step), handle conditional submission
                    if (documentType === 'others') {
                        // Get fresh documents state after update
                        const updatedDocuments = useDocumentsStore.getState().documents;

                        if (shouldSaveLocally) {
                            // Save to pending store for approved/rejected merchants
                            setPendingDocuments(updatedDocuments);
                            router.back(); // Return to review screen
                        } else if (canPartialSubmit) {
                            // Submit to API for pending merchants (current behavior)
                            await submitOnboardingStep(navigateTo, updatedDocuments);
                        }
                    } else {
                        router.push(navigateTo);
                    }
                } else {
                    toast.error(t('Something went wrong'), {
                        richColors: true,
                        style: {
                            borderWidth: 0
                        },
                        description: t('Upload succeeded but no file key was returned'),
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
                // No file provided - handle based on document type and approval status
                if (documentType === 'others') {
                    if (shouldSaveLocally) {
                        // Save current documents to pending store
                        const currentDocuments = useDocumentsStore.getState().documents;
                        setPendingDocuments(currentDocuments);
                        router.back(); // Return to review screen
                    } else if (canPartialSubmit) {
                        await submitOnboardingStep(navigateTo);
                    }
                } else {
                    router.push(navigateTo);
                }
            }
        } catch (error) {
            console.error("Final document submission error:", error);
            toast.error(t('Something went wrong'), {
                richColors: true,
                style: {
                    borderWidth: 0
                },
                description: t('Failed to upload document. Please try again.'),
            });
        }
    }, [uploadDocumentMutation.mutateAsync, addOrUpdateDocument, documentType, router, shouldSaveLocally, canPartialSubmit, setPendingDocuments]);


    const submitOnboardingStep = useCallback(async (navigateTo: Route, _documentsToSubmit?: OnboardingDocumentMetadata[]) => {
        try {
            // If specific documents provided, ensure they're used; otherwise use current store state
            // The mutation already reads from the documents state, but we ensure it's fresh
            await submitDocumentsMutation.mutateAsync();
            router.push(navigateTo);
        } catch (error) {
            console.error("Error submitting onboarding step:", error);
            toast.error(t('Something went wrong'), {
                richColors: true,
                style: {
                    borderWidth: 0
                },
                description: t('Failed to submit documents. Please try again.'),
            });
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
