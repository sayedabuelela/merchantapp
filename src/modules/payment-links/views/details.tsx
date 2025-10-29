import { formatRelativeDate, formatTime } from '@/src/core/utils/dateUtils';
import { currencyNumber } from '@/src/core/utils/number-fields';
import FontText from '@/src/shared/components/FontText';
import MainHeader from '@/src/shared/components/headers/MainHeader';
import SimpleLoader from '@/src/shared/components/loaders/SimpleLoader';
import useCountries from '@/src/shared/hooks/useCountries';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { AdjustmentsHorizontalIcon, BanknotesIcon, CalendarIcon, ChatBubbleOvalLeftEllipsisIcon, ChatBubbleOvalLeftIcon, ClockIcon, DocumentTextIcon, EnvelopeIcon, HashtagIcon, PhoneIcon, PowerIcon, QrCodeIcon, RectangleGroupIcon, ShareIcon, TagIcon, UserIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import DetailsSection from '../components/details-screen/DetailsSection';
import ExtraFeesList from '../components/details-screen/ExtraFeesList';
import InvoiceItemsList from '../components/details-screen/InvoiceItemsList';
import SectionItem from '../components/details-screen/SectionItem';
import SummaryItem from '../components/details-screen/SummaryItem';
import ActionsModal from '../components/modals/ActionsModal';
import StatusBox from '../components/StatusBox';
import usePaymentLinkVM from '../viewmodels/usePaymentLinkVM';
import { cn } from '@/src/core/utils/cn';
import DeliveryStatusBox from '../components/DeliveryStatusBox';

export default function PaymentLinkDetailsScreen() {
    const { paymentLinkId } = useLocalSearchParams<{ paymentLinkId?: string }>();
    const { t } = useTranslation();
    const [actionsVisible, setActionsVisible] = useState(false);
    const { countries } = useCountries();
    const { paymentLink, isLoadingPaymentLink } = usePaymentLinkVM(paymentLinkId);
    const actionBtnStatus = useMemo(() => {
        const approvedStatus = paymentLink?.state !== "cancelled" && paymentLink?.paymentStatus !== "paid" && paymentLink?.paymentStatus !== "expired";
        const canDeleteStatus = paymentLink?.state !== "cancelled" && paymentLink?.paymentStatus !== "paid";
        return approvedStatus || canDeleteStatus;
    }, [paymentLink?.state, paymentLink?.paymentStatus]);

    const handleCloseActions = useCallback(() => {
        setActionsVisible(false);
    }, []);

    const deliveryStatus = useMemo(() => {
        if (!paymentLink?.lastShareStatus) return null;
        return {
            email: paymentLink?.lastShareStatus?.email?.status,
            sms: paymentLink?.lastShareStatus?.sms?.status
        }
    }, [paymentLink?.lastShareStatus]);
    console.log('paymentLink', paymentLink);
    console.log('paymentLink extraFees', (paymentLink?.totalAmountWithoutFees !== undefined) || (paymentLink?.extraFees && paymentLink?.extraFees.length > 0));

    return (
        <SafeAreaView className="flex-1 bg-white">
            {isLoadingPaymentLink ? (<SimpleLoader />) :
                paymentLink && (
                    <>
                        <MainHeader title={paymentLink?.customerName} actionBtn={actionBtnStatus} onActionBtnPress={() => setActionsVisible(true)} />
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            className="flex-1 px-6">
                            <DetailsSection
                                className='mb-6'
                                icon={<RectangleGroupIcon size={24} color="#556767" />}
                                title={t("Details")}
                            >
                                <SectionItem
                                    icon={<UserIcon size={24} color="#556767" />}
                                    title={t("Customer Name")}
                                    value={paymentLink?.customerName}
                                />
                                <SectionItem
                                    icon={<HashtagIcon size={24} color="#556767" />}
                                    title={t("Payment Link ID")}
                                    value={paymentLinkId}
                                />
                                <SectionItem
                                    icon={<PowerIcon size={24} color="#556767" />}
                                    title={t("Status")}
                                    value={<StatusBox status={paymentLink?.paymentStatus} />}
                                />
                                <SectionItem
                                    icon={<BanknotesIcon size={24} color="#556767" />}
                                    title={t("Pricing")}
                                    value={paymentLink?.paymentType === "professional" ? t("Itemized") : t("Fixed Amount")}
                                />
                                <SectionItem
                                    icon={<CalendarIcon size={24} color="#556767" />}
                                    title={t("Creation date")}
                                    value={formatRelativeDate(paymentLink?.creationDate)}
                                />
                                <SectionItem
                                    icon={<ClockIcon size={24} color="#556767" />}
                                    title={t("Creation time")}
                                    value={formatTime(paymentLink?.creationDate)}
                                />
                            </DetailsSection>
                            {(paymentLink?.dueDate || paymentLink?.referenceId) && (
                                <DetailsSection
                                    className='mb-6'
                                    icon={<AdjustmentsHorizontalIcon size={24} color="#556767" />}
                                    title={t("Custom options")}
                                >
                                    <SectionItem
                                        icon={<QrCodeIcon size={24} color="#556767" />}
                                        title={t("Serial number")}
                                        value={paymentLink?.referenceId}
                                    />
                                    {paymentLink?.dueDate && (
                                        <>
                                            <SectionItem
                                                icon={<CalendarIcon size={24} color="#556767" />}
                                                title={t("Expiry date")}
                                                value={formatRelativeDate(paymentLink?.dueDate)}
                                            />
                                            <SectionItem
                                                icon={<ClockIcon size={24} color="#556767" />}
                                                title={t("Expiry time")}
                                                value={formatTime(paymentLink?.dueDate)}
                                            />
                                        </>
                                    )}
                                </DetailsSection>
                            )}
                            {paymentLink?.description && (
                                <DetailsSection
                                    icon={<DocumentTextIcon size={24} color="#556767" />}
                                    title={t("Notes")}
                                    className='mb-6'
                                >
                                    <FontText type="body" weight="regular" className="text-content-secondary self-start text-base">
                                        {paymentLink?.description}
                                    </FontText>
                                </DetailsSection>
                            )}
                            <DetailsSection
                                className='gap-y-2 mb-6'
                                icon={<TagIcon size={24} color="#556767" />}
                                title={t("Summary")}
                            >
                                {paymentLink?.paymentType === 'simple' && paymentLink?.totalAmountWithoutFees && (
                                    <SummaryItem
                                        title={t("Amount")}
                                        value={`${currencyNumber(paymentLink?.totalAmountWithoutFees)} ${paymentLink?.currency}`}
                                    />
                                )}

                                {paymentLink?.paymentType === 'professional' && paymentLink?.invoiceItems.length > 0 && (
                                    <InvoiceItemsList items={paymentLink?.invoiceItems} currency={paymentLink?.currency} />
                                )}

                                {(paymentLink?.totalAmountWithoutFees || (paymentLink?.extraFees && paymentLink?.extraFees.length > 0)) && (
                                    <View className={'border-t border-tertiary pt-2'}>
                                        {paymentLink?.totalAmountWithoutFees && (
                                            <SummaryItem
                                                summaryLabel
                                                title={t("Sub-total")}
                                                value={`${currencyNumber(paymentLink?.totalAmountWithoutFees)} ${paymentLink?.currency}`}
                                            />
                                        )}
                                        {/* {paymentLink?.extraFees && paymentLink?.extraFees.length > 0 && ( */}
                                        <ExtraFeesList
                                            extraFees={paymentLink?.extraFees}
                                            currency={paymentLink?.currency}
                                            totalAmountWithoutFees={paymentLink?.totalAmountWithoutFees}
                                        />
                                        {/* )} */}
                                    </View>
                                )}
                                <View className='border-t border-tertiary pt-2'>
                                    <SummaryItem
                                        summaryLabel
                                        title={t("Total")}
                                        value={`${currencyNumber(paymentLink?.totalAmount)} ${paymentLink?.currency}`}
                                    />
                                </View>
                            </DetailsSection>
                            {(paymentLink?.lastShareStatus.email.status || paymentLink?.lastShareStatus.sms.status) && (
                                <DetailsSection
                                    icon={<ShareIcon size={24} color="#556767" />}
                                    title={t("Delivery status")}
                                >
                                    <View className='flex-row items-center gap-x-8 '>
                                        <SectionItem
                                            icon={<EnvelopeIcon size={24} color="#556767" />}
                                            title={t("Email")}
                                            value={deliveryStatus?.email}
                                            valueClassName={cn(deliveryStatus?.email === "delivered" ? "text-success" :deliveryStatus?.email === "failed" ? "text-danger" : "text-[#B77801]", 'capitalize')}
                                        />
                                        <SectionItem
                                            icon={<ChatBubbleOvalLeftIcon size={24} color="#556767" />}
                                            title={t("SMS")}
                                            value={deliveryStatus?.sms}
                                            valueClassName={cn(deliveryStatus?.sms === "delivered" ? "text-success" :deliveryStatus?.sms === "failed" ? "text-danger" : "text-[#B77801]", 'capitalize')}
                                        />
                                    </View>
                                </DetailsSection>
                            )}
                        </ScrollView>
                    </>
                )}
            {paymentLink && (
                <ActionsModal
                    isVisible={actionsVisible}
                    onClose={handleCloseActions}
                    paymentLink={paymentLink}
                    countries={countries}
                />
            )}
        </SafeAreaView>
    )
}
