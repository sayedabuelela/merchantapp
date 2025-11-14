import { View } from "react-native";
import { OrderDetailPayment } from "@/src/modules/payments/payments.model";
import DetailsSection from "@/src/shared/components/details-screens/DetailsSection";
import { useTranslation } from "react-i18next";
import SectionRowItem from "@/src/shared/components/details-screens/SectionRowItem";
import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils";

interface Props {
    order: OrderDetailPayment;
}

const SettlementTab = ({ order }: Props) => {
    const { t } = useTranslation();
    return (
        <View>
            <DetailsSection>
                <SectionRowItem
                    title={t('Gross amount')} value={'100 EGP'} />
                <SectionRowItem title={t('Fees')} value={`5 EGP`} />
                <SectionRowItem
                    valueClassName={'capitalize'}
                    title={t('VAT (14%)')} value={'0.25 EGP'} />
                <SectionRowItem
                    className="pt-4 mt-4 border-t border-tertiary"
                    title={t('Net amount')}
                    value={'95 EGP'} />
            </DetailsSection>
            <DetailsSection className='mt-4'>
                <SectionRowItem title={'Account ID'} value={'ACC-123-123'} />
                <SectionRowItem title={'Account name'} value={'Account name'} />
                <SectionRowItem title={'Account source'} value={'Account source'} />
            </DetailsSection>
            <DetailsSection  className='mt-4'>
                <SectionRowItem title={'Tier name'} value={'Enterprise'} />
                <SectionRowItem title={'Transaction rate'} value={'1.2%'} />
                <SectionRowItem title={'RFS Date'} value={'T-1'} />
            </DetailsSection>
        </View>
    )
}

export default SettlementTab;
