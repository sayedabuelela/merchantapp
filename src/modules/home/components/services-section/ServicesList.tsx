import React from 'react'
import { FlatList, Pressable, View } from 'react-native'
import FontText from '@/src/shared/components/FontText'
import ServiceCard from './ServiceCard'
import { useTranslation } from 'react-i18next'
import { ArrowRightIcon, ArrowsUpDownIcon, ArrowUpLeftIcon, BanknotesIcon, LinkIcon, PlusIcon, QrCodeIcon } from 'react-native-heroicons/outline'
import { Link } from 'expo-router'
import { ROUTES } from '@/src/core/navigation/routes'

const ServicesList = () => {
    const { t } = useTranslation()

    const services = [
        {
            title: t('QR code payments'),
            description: t('Get paid with a QR code'),
            href: '/service',
            icon: <QrCodeIcon size={20} color="#001F5F" />
        },
        {
            title: t('POS'),
            description: t('Request a new terminal'),
            href: '/service',
            icon: <PlusIcon size={20} color="#001F5F" />
        },
        {
            title: t('Payment links'),
            description: t('Request payments easily'),
            href: ROUTES.TABS.PAYMENT_LINKS,
            icon: <LinkIcon size={20} color="#001F5F" />
        },
        {
            title: t('Transfers'),
            description: t('Send money to others'),
            href: '/service',
            icon: <ArrowUpLeftIcon size={20} color="#001F5F" />
        },
        {
            title: t('Payouts'),
            description: t('Receive your funds'),
            href: ROUTES.BALANCE.ACTIVITIES,
            icon: <BanknotesIcon size={20} color="#001F5F" />
        },
        {
            title: t('Orders'),
            description: t('Track all of your transactions'),
            href: ROUTES.TABS.PAYMENTS,
            icon: <ArrowsUpDownIcon size={20} color="#001F5F" />
        },
    ];
    return (
        <View className="my-8">
            <View className='flex-row items-center justify-between mb-4'>
                <FontText type="head" weight="bold" className='text-xl self-start text-content-primary'>{t('Services')}</FontText>
                <Link href="/services" asChild>
                    <Pressable className='flex-row items-center gap-2'>
                        <FontText type="body" weight="regular" className='text-primary text-xs'>{t('All Services')}</FontText>
                        <ArrowRightIcon size={16} color="#001F5F" />
                    </Pressable>
                </Link>
            </View>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName='gap-2'
                data={services}
                renderItem={({ item }) => <ServiceCard {...item} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}

export default ServicesList