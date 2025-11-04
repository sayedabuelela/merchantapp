import { ROUTES } from "@/src/core/navigation/routes";
import { useTranslation } from "react-i18next";
import GenericDocumentUpload from "../components/GenericDocumentUpload";

const TaxIdScreen = () => {
    const { t } = useTranslation();
    const documentRule = t('Ensure valid date and match personal/business name with uploaded documents.');

    return (
        <GenericDocumentUpload
            progress={80}
            documentRule={documentRule}
            documentUploadBoxTitle={t('Tax ID2')}
            documentType="taxId"
            nextRoute={ROUTES.ONBOARDING.DOCUMENTS.OTHERS}
        />
    )
}

export default TaxIdScreen;