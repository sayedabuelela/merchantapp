import { useApi } from "@/src/core/api/clients.hooks";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Document, FileDownloadApiResponse } from "../documents.model";
import { getDocumentFileData as getFileContentService } from "../documents.service";
import { useDocumentsStore } from "../documents.store";

const useDocuments = ({ documents }: { documents: Document[] }) => {
    const [documentKeys, setDocumentKeys] = useState<string>("")
    const { api } = useApi();
    const addOrUpdateDocument = useDocumentsStore(state => state.addOrUpdateDocument);
    const documentsInStore = useDocumentsStore(state => state.documents);
    const queryClient = useQueryClient();
    const prefetchDocuments = async () => {
        await queryClient.prefetchQuery({
            queryKey: ['all-documents', documentKeys],
            queryFn: () => getFileContentService(api, documentKeys),
        })
    }
    useEffect(() => {
        if (!documents?.length) return;

        let fileKeys = '';

        documents.forEach((documentItem, index) => {
            const existingDocIndex = documentsInStore.findIndex(
                (d: Document) => d.documentType === documentItem.documentType
            );

            const needsUpdate = existingDocIndex === -1 ||
                documentsInStore[existingDocIndex].key !== documentItem.key;

            if (needsUpdate) {
                addOrUpdateDocument({
                    key: documentItem.key,
                    documentType: documentItem.documentType,
                    isDeleted: false,
                    isReviewd: false,
                });
            }

            fileKeys += `fileKeys[]=${documentItem.key}${(documents.length - 1) !== index ? '&' : ''}`;
        });

        setDocumentKeys(fileKeys);
    }, [documents, addOrUpdateDocument]);
    
    useEffect(() => {
        if (documentKeys) {
            prefetchDocuments()
        }
    }, [documentKeys, queryClient, api]);

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

