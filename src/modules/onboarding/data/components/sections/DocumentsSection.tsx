import { ROUTES } from "@/src/core/navigation/routes";
import { Document, DownloadedFileObject } from "@/src/modules/onboarding/documents/documents.model";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import useDocuments from "../../../documents/hooks/useDocuments";
import AccordionItem from "../AccordionItem";
import DataDocumentRow from "../DataDocumentRow";

interface DocumentsSectionProps {
    documents: Document[];
    showEditButton?: boolean;
}

const DocumentsSection = ({
    documents,
    showEditButton = true,
}: DocumentsSectionProps) => {
    const { t } = useTranslation();
    const { isLoadingDocuments, allDocumentsData } = useDocuments({ documents });
    // console.log('allDocumentsData : ', allDocumentsData?.result[1].documentType);
    // console.log('documents',documents);
    const renderItem = ({ item }: { item: DownloadedFileObject }) => (
        <DataDocumentRow
            label={item.documentType}
            url={`data:${item.type};base64,${item.file}`} // Still needs optimization!
        />
    );
    return (
        <AccordionItem
            title={t('Documents')}
            editRoute={ROUTES.ONBOARDING.DOCUMENTS.NATIONAL_ID_FACE}
            showEditButton={showEditButton}
        >
            {isLoadingDocuments ? (
                <ActivityIndicator />
            ) : (
                allDocumentsData?.result?.map((item, index) => (
                    <DataDocumentRow
                        key={index}
                        label={item.documentType}
                        url={`data:${item.type};base64,${item.file}`} // Still needs optimization!
                    />
                ))
            )}
        </AccordionItem>
    )
}

export default DocumentsSection
