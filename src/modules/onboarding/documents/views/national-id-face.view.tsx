import { ROUTES } from "@/src/core/navigation/routes";
import { useTranslation } from "react-i18next";
import { accountTypeSelector, useOnboardingStore } from "../../onboarding.store";
import GenericDocumentUpload from "../components/GenericDocumentUpload";

const NationalIdFaceScreen = () => {
    const { t } = useTranslation();
    const accountType = useOnboardingStore(accountTypeSelector);

    const documentRule = t(accountType === 'registered' ? 'The national ID that’s present in the Commercial Register.' : 'National ID date should be valid.');

    return (
        <GenericDocumentUpload
            progress={60}
            documentRule={documentRule}
            documentUploadBoxTitle={t('National ID')}
            documentType="nationalId"
            nextRoute={ROUTES.ONBOARDING.DOCUMENTS.NATIONAL_ID_BACK}
        />
    )
}

export default NationalIdFaceScreen;