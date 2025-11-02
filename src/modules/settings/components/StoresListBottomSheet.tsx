import BottomSheetHeader from '@/src/shared/components/bottom-sheets/BottomSheetHeader';
import Button from '@/src/shared/components/Buttons/Button';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BelongsTo } from '../../auth/auth.model';
import { selectUser, useAuthStore } from '../../auth/auth.store';
import StoresList from './StoresList';
import GeneralModalHeader from '@/src/shared/components/GeneralModal/GeneralModalHeader';

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
        const snapPoints = ['45%'];

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
        const renderBackdrop = (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                pressBehavior="none"
            />
        );

        return (
            <BottomSheet
                ref={storesBottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                // enablePanDownToClose={false}
                // enableContentPanningGesture={false}
                onClose={onClose}
                animateOnMount
                enableDynamicSizing={false}
                backdropComponent={renderBackdrop}
                enableContentPanningGesture={false}
            >
                <BottomSheetView className="flex-1 px-6 pt-2 h-full pb-8">
                    <GeneralModalHeader
                        title={t('Select store')}
                        onClose={handleCloseBottomSheet}
                    />
                    <StoresList
                        stores={stores}
                        // onSelectStore={onSelectStore}
                        activeStore={activeStore}
                        setActiveStore={setActiveStore}
                    />
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