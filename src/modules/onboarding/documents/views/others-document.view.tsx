import { ROUTES } from "@/src/core/navigation/routes";
import { useTranslation } from "react-i18next";
import GenericDocumentUpload from "../components/GenericDocumentUpload";

const OthersDocumentScreen = () => {
    const { t } = useTranslation();

    const documentRule = t('Upload any others document.');

    return (
        <GenericDocumentUpload
            progress={60}
            documentRule={documentRule}
            documentUploadBoxTitle={t('Others')}
            documentType="others"
            nextRoute={ROUTES.ONBOARDING.CURRENCY_SETTINGS}
            isOptional={true}
        />
    )
}

export default OthersDocumentScreen;