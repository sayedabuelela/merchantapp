import { ROUTES } from "@/src/core/navigation/routes";
import { useTranslation } from "react-i18next";
import { accountTypeSelector, useOnboardingStore } from "../../onboarding.store";
import GenericDocumentUpload from "../components/GenericDocumentUpload";

const NationalIdBackScreen = () => {
    const { t } = useTranslation();
    const accountType = useOnboardingStore(accountTypeSelector);
    // console.log("accountType : ", accountType);
    const documentRule = t(accountType === 'registered' ? 'The national ID that’s present in the Commercial Register.' : 'National ID date should be valid.');

    const nextRouteMap = {
        'professional': ROUTES.ONBOARDING.DOCUMENTS.TAX_ID,
        'registered': ROUTES.ONBOARDING.DOCUMENTS.COMMERCIAL,
        'individual': ROUTES.ONBOARDING.DOCUMENTS.UTILITY_BILL,
    };
    
    const handleNextRoute = nextRouteMap[accountType!];
    // console.log("handleNextRoute", handleNextRoute);
    return (
        <GenericDocumentUpload
            progress={73.5}
            documentRule={documentRule}
            documentUploadBoxTitle={t('National ID Back')}
            documentType="nationalIdBack"
            nextRoute={handleNextRoute}
        />
    )
}

export default NationalIdBackScreen;