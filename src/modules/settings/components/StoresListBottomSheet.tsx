import Button from '@/src/shared/components/Buttons/Button';
import GeneralModalHeader from '@/src/shared/components/GeneralModal/GeneralModalHeader';
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BelongsTo } from '../../auth/auth.model';
import { useAuthStore } from '../../auth/auth.store';
import StoresList from './StoresList';
import { View } from 'react-native';

interface Props {
    onClose: () => void;
    stores: BelongsTo[];
    onSelectStore: (merchantId: string) => void;
}

export interface StoresListBottomSheetRef {
    expand: () => void;
    close: () => void;
}

const StoresListBottomSheet = forwardRef<StoresListBottomSheetRef, Props>(
    ({ onClose, stores, onSelectStore }, ref) => {
        const { t } = useTranslation();
        const currentMerchantId = useAuthStore((state) => state.user?.merchantId);
        const [activeStore, setActiveStore] = useState<string | undefined>(currentMerchantId);
        const snapPoints = ['60%'];

        const storesBottomSheetRef = useRef<BottomSheet | null>(null);

        useImperativeHandle(ref, () => ({
            expand: () => {
                storesBottomSheetRef.current?.expand();
            },
            close: () => {
                storesBottomSheetRef.current?.close();
            }
        }), []);

        const handleCloseBottomSheet = useCallback(() => {
            storesBottomSheetRef.current?.close();
            setActiveStore(currentMerchantId);
        }, []);

        // const countryData = useMemo(() => countries ?? [], [countries]);
        const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                pressBehavior="none"
                opacity={0.5}
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            />
        ), []);

        return (
            <BottomSheet
                ref={storesBottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                onClose={onClose}
                animateOnMount
                enableDynamicSizing={false}
                enableContentPanningGesture={true}
                enablePanDownToClose={false}
            >
                <BottomSheetView className="flex-1 px-6 pt-2">
                    <GeneralModalHeader
                        title={t('Select store')}
                        onClose={handleCloseBottomSheet}
                    />
                    <View style={{ flex: 1, minHeight: 0 }}>
                        <StoresList
                            stores={stores}
                            activeStore={activeStore}
                            setActiveStore={setActiveStore}
                        />
                    </View>
                    <Button
                        title={t('Select')}
                        onPress={() => {
                            onSelectStore(activeStore!);
                        }}
                        className="mt-6"
                        disabled={activeStore === currentMerchantId}
                    />
                </BottomSheetView>
            </BottomSheet>
        );
    }
)

export default StoresListBottomSheet