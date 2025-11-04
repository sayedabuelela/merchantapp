import { ROUTES } from "@/src/core/navigation/routes";
import { useTranslation } from "react-i18next";
import GenericDocumentUpload from "../components/GenericDocumentUpload";

const UtilityBillScreen = () => {
    const { t } = useTranslation();

    const documentRule = t('Upload recent electricity, water, or gas bill (Issuing date must be within 3 months)');

    return (
        <GenericDocumentUpload
            progress={60}
            documentRule={documentRule}
            documentUploadBoxTitle={t('Utility Bill')}
            documentType="utilityBill"
            nextRoute={ROUTES.ONBOARDING.DOCUMENTS.OTHERS}
        />
    )
}

export default UtilityBillScreen;