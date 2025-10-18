import { ROUTES } from "@/src/core/navigation/routes";
import { BusinessContactFormData } from "@/src/modules/onboarding/contact/contact.model";
import { useTranslation } from "react-i18next";
import AccordionItem from "../AccordionItem";
import DataRow from "../DataRow";

const BusinessContactSection = ({
    country,
    governorate,
    addressLine1,
    addressLine2,
    businessPhone,
    businessEmail,
    hotlineNumber
}: BusinessContactFormData) => {
    const { t } = useTranslation();
    return (
        <AccordionItem
            title={t('Business Contact Info')}
            editRoute={ROUTES.ONBOARDING.CONTACT}
        >
            <DataRow label={t('Country')} value={country} />
            <DataRow label={t('Governorate')} value={governorate} />
            <DataRow label={t('Address Line 1')} value={addressLine1} />
            <DataRow label={t('Address Line 2')} value={addressLine2} />
            <DataRow label={t('Business Phone')} value={businessPhone} />
            <DataRow label={t('Business Email')} value={businessEmail} />
            <DataRow label={t('Hotline')} value={hotlineNumber} />
        </AccordionItem>
    )
}

export default BusinessContactSection