import { ROUTES } from "@/src/core/navigation/routes";
import { useTranslation } from "react-i18next";
import { PublicData } from "../../onboarding-data.model";
import AccordionItem from "../AccordionItem";
import DataRow from "../DataRow";

interface BusinessDetailsSectionProps extends PublicData {
  showEditButton?: boolean;
}

const BusinessDetailsSection = ({
  legalCompanyName,
  storeName,
  businessIndustry,
  description,
  companyWebsite,
  socialLinkedIn,
  socialFacebook,
  socialInstagram,
  socialTwitter,
  showEditButton = true,
}: BusinessDetailsSectionProps) => {
  const { t } = useTranslation();
  return (
    <AccordionItem
      title={t('Business Details')}
      editRoute={ROUTES.ONBOARDING.BUSINESS}
      showEditButton={showEditButton}
    >
      <DataRow label={t('Company Name')} value={legalCompanyName} />
      <DataRow label={t('Business/Commercial Name')} value={storeName} />
      <DataRow label={t('Business Industry')} value={businessIndustry} />
      <DataRow label={t('Business Description')} value={description} />
      <DataRow label={t('Website URL')} value={companyWebsite} />
      <DataRow label={t('LinkedIn')} value={socialLinkedIn} />
      <DataRow label={t('Facebook')} value={socialFacebook} />
      <DataRow label={t('Instagram')} value={socialInstagram} />
      <DataRow label={t('Twitter')} value={socialTwitter} />
    </AccordionItem>
  )
}

export default BusinessDetailsSection