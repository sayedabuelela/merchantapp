import { useApi } from "@/src/core/api/clients.hooks";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Document, FileDownloadApiResponse } from "../documents.model";
import { getDocumentFileData as getFileContentService } from "../documents.service";
import { useDocumentsStore } from "../documents.store";

const useDocuments = ({ documents }: { documents: Document[] }) => {
    const [documentKeys, setDocumentKeys] = useState<string>("")
    const { api } = useApi();
    const addOrUpdateDocument = useDocumentsStore(state => state.addOrUpdateDocument);
    const documentsInStore = useDocumentsStore(state => state.documents);
    const queryClient = useQueryClient();

    const prefetchDocuments = useCallback(async () => {
        if (!documentKeys) return;
        await queryClient.prefetchQuery({
            queryKey: ['all-documents', documentKeys],
            queryFn: () => getFileContentService(api, documentKeys),
        })
    }, [documentKeys, queryClient, api]);

    useEffect(() => {
        if (!documents?.length) return;

        let fileKeys = '';
        let shouldUpdate = false;

        documents.forEach((documentItem, index) => {
            const existingDocIndex = documentsInStore.findIndex(
                (d: Document) => d.documentType === documentItem.documentType
            );

            const needsUpdate = existingDocIndex === -1 ||
                documentsInStore[existingDocIndex].key !== documentItem.key;

            if (needsUpdate) {
                shouldUpdate = true;
            }

            fileKeys += `fileKeys[]=${documentItem.key}${(documents.length - 1) !== index ? '&' : ''}`;
        });

        // Only update store if actually needed, and do it in a batch
        if (shouldUpdate) {
            documents.forEach((documentItem) => {
                addOrUpdateDocument({
                    key: documentItem.key,
                    documentType: documentItem.documentType,
                    isDeleted: false,
                    isReviewd: false,
                });
            });
        }

        setDocumentKeys(fileKeys);
    }, [documents]);

    useEffect(() => {
        prefetchDocuments();
    }, [prefetchDocuments]);

    const {
        data: allDocumentsData,
        isLoading: isLoadingDocuments,
        error: documentsError,
        refetch: refetchDocuments,
    }: UseQueryResult<FileDownloadApiResponse | null, Error> = useQuery({
        queryKey: ['all-documents', documentKeys],
        queryFn: async () => {
            if (!documentKeys) return null;
            const rawResponse = await getFileContentService(api, documentKeys);
            return rawResponse
        },
        enabled: !!documentKeys,
        staleTime: 24 * 60 * 60 * 1000,
    });

    return {
        allDocumentsData,
        isLoadingDocuments,
        documentsError,
        refetchDocuments
    }
}

export default useDocuments;

