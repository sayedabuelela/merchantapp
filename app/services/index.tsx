import ServiceCard from '@/src/modules/home/components/services-section/ServiceCard'
import CreatePaymentModal from '@/src/modules/payment-links/components/modals/CreatePaymentModal'
import MainHeader from '@/src/shared/components/headers/MainHeader'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useServices } from '@/src/modules/home/hooks/useServices'

const Services = () => {
    const { t } = useTranslation()
    const [isCreatePLModalVisible, setCreatePLModalVisible] = useState(false);

    const handleQRCodePress = () => {
        setCreatePLModalVisible(!isCreatePLModalVisible);
    };

    const services = useServices(handleQRCodePress);
    return (
        <SafeAreaView className="flex-1 bg-white">
            <MainHeader title={t('All services')} />
            <View className="flex-1 px-6">
                <FlatList
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{ gap: 12 }}
                    contentContainerStyle={{ gap: 8, paddingVertical: 16 }}
                    data={services}
                    renderItem={({ item }) => (
                        <View className="flex-1">
                            <ServiceCard {...item} />
                        </View>
                    )}
                    keyExtractor={(_, index) => index.toString()}
                />
            </View>
            <CreatePaymentModal isVisible={isCreatePLModalVisible} onClose={handleQRCodePress} />
        </SafeAreaView>
    )
}

export default Services