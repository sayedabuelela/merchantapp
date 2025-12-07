import { formatAMPM, formatRelativeDate } from '@/src/core/utils/dateUtils';
import { currencyNumber } from '@/src/core/utils/number-fields';
import FontText from '@/src/shared/components/FontText';
import MainHeader from '@/src/shared/components/headers/MainHeader';
import SimpleLoader from '@/src/shared/components/loaders/SimpleLoader';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import {
    ArrowsUpDownIcon,
    BanknotesIcon,
    BookmarkIcon,
    BuildingLibraryIcon,
    CalendarDaysIcon,
    CalendarIcon,
    ChatBubbleBottomCenterIcon,
    CheckCircleIcon,
    CircleStackIcon,
    CubeTransparentIcon,
    CurrencyPoundIcon,
    FingerPrintIcon,
    IdentificationIcon,
    PaperClipIcon,
    PowerIcon,
    RectangleGroupIcon,
    UserIcon
} from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import DetailsSection from '../../../shared/components/details-screens/DetailsSection';
import SectionItem from '../../../shared/components/details-screens/SectionItem';
import SummaryItem from '../../payment-links/components/details-screen/SummaryItem';
import StatusBox from '../../payment-links/components/StatusBox';
import { PaymentStatus } from '../../payment-links/payment-links.model';
import ActivityCard from '../components/ActivityCard';
import { useActivityDetails, useActivityPaymentDetails, useActivityTransferDetails } from '../viewmodels/useActivity';
import { useSettlementWindow } from '../viewmodels/useSettlementWindow';

const ActivityDetails = () => {

    const { t } = useTranslation();
    const { _id } = useLocalSearchParams<{ _id?: string }>();

    const { data: activity, isLoading: isLoadingActivity } = useActivityDetails(_id!);
    const originReference = activity?.originReference ?? "";
    const origin = activity?.origin;
    const isTransfer = origin === "transfers";
    const isPayment = origin === "payments";
    const { data: transfer } = useActivityTransferDetails(originReference, { enabled: isTransfer });
    const { data: payment } = useActivityPaymentDetails(originReference, { enabled: isPayment });
    const { data: settlementBatchs } = useSettlementWindow({ accountId: activity?.accountId ?? "" });
    console.log('_id : ', _id);
    console.log('activity : ', activity);
    console.log('transfer : ', transfer);
    console.log('payment : ', payment);
    console.log('isPayment : ', isPayment);
    console.log('transfer?.status.toUpperCase() : ', activity?.originalAmount);
    // console.log('')
    // console.log('transefer' )
    // console.log('batch : ', batchs);
    return (
        <SafeAreaView className="flex-1 bg-white">
            {isLoadingActivity ? (<SimpleLoader />) :
                activity && (
                    <>
                        <MainHeader title={t(`${activity.operation === 'topup' || activity.operation === 'deduct' ? "Adjustment" : activity.operation} details`)} />
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
                                    icon={<CurrencyPoundIcon size={24} color="#556767" />}
                                    title={activity.accountName}
                                    value={activity.accountId}
                                    valueClassName="uppercase"
                                />

                                <SectionItem
                                    icon={<ArrowsUpDownIcon size={24} color="#556767" />}
                                    title={t("Type")}
                                    value={activity.operation === 'topup' || activity.operation === 'deduct' ? t('Kashier Adjustments') : activity.operation}
                                    valueClassName="capitalize"
                                />

                                <SectionItem
                                    icon={<CheckCircleIcon size={24} color="#556767" />}
                                    title={t("Reflected")}
                                    value={t(activity.isReflected ? "Yes" : "No")}
                                />

                                <SectionItem
                                    icon={<PaperClipIcon size={24} color="#556767" />}
                                    title={t("External Ref")}
                                    value={activity.originReference}
                                    valueClassName="uppercase"
                                />

                                <SectionItem
                                    icon={<CubeTransparentIcon size={24} color="#556767" />}
                                    title={t("Origin")}
                                    value={activity.origin === "operations team" ? t('System') : activity.origin}
                                    valueClassName="capitalize"
                                />

                                {(transfer?.method !== undefined || payment?.method !== undefined) && (
                                    <SectionItem
                                        icon={<BanknotesIcon size={24} color="#556767" />}
                                        title={t("Method")}
                                        value={transfer?.method || payment?.method}
                                        valueClassName="capitalize"
                                    />
                                )}

                                {transfer?.status !== undefined && (
                                    <SectionItem
                                        icon={<PowerIcon size={24} color="#556767" />}
                                        title={t("Status")}
                                        value={<StatusBox status={transfer?.status.toUpperCase() as PaymentStatus} />}
                                    />
                                )}

                                <SectionItem
                                    icon={<CalendarIcon size={24} color="#556767" />}
                                    title={t(`${activity.operation === "payout" ? "Payout" : "Entry"} date`)}
                                    value={`${formatRelativeDate(activity.createdAt)}, ${formatAMPM(activity.createdAt)}`}
                                />

                                {activity.operation !== "payout" && (
                                    <SectionItem
                                        icon={<CalendarDaysIcon size={24} color="#556767" />}
                                        title={t("Value date")}
                                        value={formatRelativeDate(activity.valueDate)}
                                    />
                                )}

                            </DetailsSection>
                            {transfer !== undefined && (
                                <DetailsSection
                                    className='mb-6'
                                    icon={<IdentificationIcon size={24} color="#556767" />}
                                    title={t("Recipient")}
                                >
                                    <SectionItem
                                        icon={<UserIcon size={24} color="#556767" />}
                                        title={t("Recipient name")}
                                        value={transfer.recipientName}
                                    />
                                    <SectionItem
                                        icon={<FingerPrintIcon size={24} color="#556767" />}
                                        title={t("Account number")}
                                        value={transfer.recipientNumber}
                                    />
                                    <SectionItem
                                        icon={<BuildingLibraryIcon size={24} color="#556767" />}
                                        title={t("Bank")}
                                        value={transfer.recipientBank}
                                    />
                                </DetailsSection>
                            )}

                            <DetailsSection
                                className='gap-y-0 mb-6'
                                icon={<BookmarkIcon size={24} color="#556767" />}
                                title={t("Summary")}
                            >
                                <FontText type="body" weight="bold"
                                    className="text-content-secondary self-start text-base mb-2 mt-6">
                                    {t("Activity")}
                                </FontText>
                                <SummaryItem
                                    title={t("Gross amount")}
                                    value={activity.originalAmount === undefined ? '--' : currencyNumber(activity.originalAmount) + ' ' + t('EGP')}
                                    className='mb-4'
                                />
                                <SummaryItem
                                    title={t("Fees")}
                                    value={activity.fees === undefined ? '--' : currencyNumber(Number(activity.fees)) + ' ' + t('EGP')}
                                    className='mb-1'
                                />
                                {/* <SummaryItem
                                    title={t("VAT (14%)")}
                                    value={currencyNumber(Number(activity.fees))}
                                /> */}
                                <SummaryItem
                                    title={t("Net amount")}
                                    value={currencyNumber(activity.amount) + ' ' + t('EGP')}
                                    className='py-4 my-4 border-y border-tertiary'
                                />
                                <FontText type="body" weight="bold"
                                    className="text-content-secondary self-start text-base mb-2">
                                    {t("Balance info")}
                                </FontText>
                                <SummaryItem
                                    title={t("Total balance before")}
                                    value={currencyNumber(activity.totalBalanceBefore) + ' ' + t('EGP')}
                                    className='mb-4'
                                />
                                <SummaryItem
                                    title={t("Total balance after")}
                                    value={currencyNumber(activity.totalBalanceAfter) + ' ' + t('EGP')}
                                />
                            </DetailsSection>

                            <DetailsSection
                                icon={<ChatBubbleBottomCenterIcon size={24} color="#556767" />}
                                title={t("Comment")}
                                className='mb-6'
                            >
                                <FontText type="body" weight="regular"
                                    className="text-content-primary self-start text-base">
                                    {activity.comment !== undefined ? activity.comment : "----"}
                                </FontText>
                            </DetailsSection>
                            {(settlementBatchs !== undefined && settlementBatchs.length > 0) && (
                                <DetailsSection
                                    // icon={<ClockIcon size={24} color="#556767" />}
                                    icon={<CircleStackIcon size={24} color="#556767" />}
                                    title={t("Batch records")}
                                    className='mb-6 gap-y-0'
                                >
                                    <View className='mt-5'>
                                        {settlementBatchs?.map((batch) => (
                                            <ActivityCard
                                                key={batch._id}
                                                {...batch}
                                            />
                                        ))}
                                    </View>
                                </DetailsSection>
                            )}
                        </ScrollView>
                    </>
                )}
        </SafeAreaView>
    )
}

export default ActivityDetails