import { ROUTES } from "@/src/core/navigation/routes";
import { useTranslation } from "react-i18next";
import GenericDocumentUpload from "../components/GenericDocumentUpload";

const CommercialScreen = () => {
    const { t } = useTranslation();

    const documentRule = t('Valid date, preferably issued within the last 3 months, and all pages should be uploaded.');

    return (
        <GenericDocumentUpload
            progress={60}
            documentRule={documentRule}
            documentUploadBoxTitle={t('Commercial ID')}
            documentType="commercialTaxId"
            nextRoute={ROUTES.ONBOARDING.DOCUMENTS.TAX_ID}
        />
    )
}

export default CommercialScreen;