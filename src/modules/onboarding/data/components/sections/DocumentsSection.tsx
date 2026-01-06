import { ROUTES } from "@/src/core/navigation/routes";
import { Document } from "@/src/modules/onboarding/documents/documents.model";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import useDocuments from "../../../documents/hooks/useDocuments";
import AccordionItem from "../AccordionItem";
import DataDocumentRow from "../DataDocumentRow";
import FontText from "@/src/shared/components/FontText";

interface DocumentsSectionProps {
    documents: Document[];
    showEditButton?: boolean;
    hasUnsavedChanges?: boolean;
}

const DocumentsSection = ({
    documents,
    showEditButton = true,
    hasUnsavedChanges = false,
}: DocumentsSectionProps) => {
    const { t } = useTranslation();

    // Filter out deleted documents
    const activeDocuments = useMemo(() =>
        documents?.filter(doc => !doc.isDeleted && doc.key) || [],
        [documents]
    );

    const { isLoadingDocuments, allDocumentsData } = useDocuments({ documents: activeDocuments });

    const hasDocuments = allDocumentsData?.result && allDocumentsData.result.length > 0;

    return (
        <AccordionItem
            title={t('Documents')}
            editRoute={ROUTES.ONBOARDING.DOCUMENTS.NATIONAL_ID_FACE}
            showEditButton={showEditButton}
            hasUnsavedChanges={hasUnsavedChanges}
        >
            {isLoadingDocuments ? (
                <ActivityIndicator />
            ) : hasDocuments ? (
                allDocumentsData.result.map((item, index) => (
                    <DataDocumentRow
                        key={index}
                        label={item.documentType}
                        url={`data:${item.type};base64,${item.file}`}
                        mimeType={item.type}
                    />
                ))
            ) : (
                <View className="py-2">
                    <FontText type="body" weight="regular" className="text-content-tertiary text-sm">
                        {t('No documents uploaded')}
                    </FontText>
                </View>
            )}
        </AccordionItem>
    )
}

export default DocumentsSection
