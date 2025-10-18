import { create } from 'zustand';
import { Document, DocumentType } from './documents.model';

interface DocumentsStore {
    documents: Document[];
    setDocuments: (docs: Document[]) => void;
    addOrUpdateDocument: (doc: Document) => void;
    removeDocument: (documentType: DocumentType) => void;
    clearDocuments: () => void;
    getDocumentByType: (documentType: DocumentType) => Document | undefined;
}

export const useDocumentsStore = create<DocumentsStore>((set, get) => ({
    documents: [], // Start with an empty list
    setDocuments: (docs: Document[]) => set({ documents: docs }),
    addOrUpdateDocument: (doc: Document) => set(state => {
        const existingIndex = state.documents.findIndex(d => d.documentType === doc.documentType);
        let newDocs = [...state.documents];

        if (existingIndex > -1) {
            newDocs[existingIndex] = doc; // Update existing
        } else {
            newDocs.push(doc); // Add new
        }
        return { documents: newDocs };
    }),

    removeDocument: (documentType: DocumentType) => set(state => ({
        documents: state.documents.filter(d => d.documentType !== documentType)
    })),

    clearDocuments: () => set({ documents: [] }), // Essential!

    getDocumentByType: (documentType: DocumentType) => {
        return get().documents.find(d => d.documentType === documentType);
    }
}));