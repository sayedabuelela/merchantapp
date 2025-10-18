import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { FlatList, ScrollView, View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import Button from '@/src/shared/components/Buttons/Button';
import { useTranslation } from 'react-i18next';
import BottomSheetHeader from '@/src/shared/components/bottom-sheets/BottomSheetHeader';
import { MotiView } from 'moti';
import StoresList, { StoreItemProps } from './StoresList';
import { BelongsTo } from '../../auth/auth.model';

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
    ({ onClose, stores,onSelectStore }, ref) => {
        const { t } = useTranslation();

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
        }, []);

        // const countryData = useMemo(() => countries ?? [], [countries]);
        const renderBackdrop = (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
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
                    <BottomSheetHeader
                        title={t('Select store')}
                        onClose={handleCloseBottomSheet}
                    />
                    <StoresList stores={stores} onSelectStore={onSelectStore} />
                    <Button
                        title={t('Close')}
                        onPress={handleCloseBottomSheet}
                        className="mt-6"
                    />
                </BottomSheetView>
            </BottomSheet>
        );
    }
)

export default StoresListBottomSheet