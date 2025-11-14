import {View} from "react-native";
import {OrderDetailPayment} from "@/src/modules/payments/payments.model";
import DetailsSection from "@/src/shared/components/details-screens/DetailsSection";
import {useTranslation} from "react-i18next";
import SectionRowItem from "@/src/shared/components/details-screens/SectionRowItem";
import {formatAMPM, formatRelativeDate} from "@/src/core/utils/dateUtils";

interface Props {
    order: OrderDetailPayment;
}

const DetailsTab = ({order}: Props) => {
    const {t} = useTranslation();
    return (
        <View>
            <DetailsSection title={t('Recent transaction')}>
                <SectionRowItem
                    valueClassName={'capitalize mr-[1px]'}
                    title={t('Transaction type')} value={order.lastTransactionType}/>
                <SectionRowItem title={t('Updated')}
                                value={`${formatRelativeDate(order.updatedAt)}, ${formatAMPM(order.updatedAt)}`}/>
                <SectionRowItem
                    valueClassName={'capitalize'}
                    title={t('Status')} value={order.history[0].status}/>
                <SectionRowItem title={t('Transaction ID')} value={order.targetTransactionId}/>
            </DetailsSection>
            <DetailsSection className='mt-4'>
                <SectionRowItem title={'Customer name'} value={order.metaData.kashierOriginDetails.customerName}/>
                <SectionRowItem title={'Phone'} value={order.metaData.kashierOriginDetails.customerPhone}/>
                <SectionRowItem title={'Email'} value={order.metaData?.kashierOriginDetails?.customerEmail}/>
                <SectionRowItem title={'Ref ID'} value={order.metaData?.kashierOriginDetails?.id}/>
            </DetailsSection>
            <DetailsSection title={'More data'} className='mt-4'>
                <SectionRowItem title={'Customer name'} value={'value'}/>
                <SectionRowItem title={'Customer ID'} value={'value'}/>
                <SectionRowItem title={'Status'} value={'value'}/>
                <SectionRowItem title={'IP address'} value={order.metaData?.termsAndConditions?.ip}/>
            </DetailsSection>
        </View>
    )
}

export default DetailsTab;
