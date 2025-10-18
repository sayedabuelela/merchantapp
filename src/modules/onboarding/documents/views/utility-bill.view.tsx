import { ROUTES } from "@/src/core/navigation/routes";
import { useTranslation } from "react-i18next";
import { accountTypeSelector, useOnboardingStore } from "../../onboarding.store";
import GenericDocumentUpload from "../components/GenericDocumentUpload";

const UtilityBillScreen = () => {
    const { t } = useTranslation();
    const accountType = useOnboardingStore(accountTypeSelector);

    const documentRule = t(accountType === 'registered' ? 'The national ID that’s present in the Commercial Register.' : 'National ID date should be valid.');

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