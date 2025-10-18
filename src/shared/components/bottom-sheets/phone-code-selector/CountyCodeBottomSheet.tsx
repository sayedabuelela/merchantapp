import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef, useRef, useMemo, useCallback, useImperativeHandle, memo } from 'react';
import { TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next";
import { XMarkIcon } from 'react-native-heroicons/outline';
import FontText from '../../FontText';
import CountryCodeItem from './CountryCodeItem';
import { ICountry } from '@/src/shared/hooks/useCountries';
import { FlashList } from '@shopify/flash-list';
import BottomSheetHeader from '../BottomSheetHeader';

export interface CountyCodeBottomSheetRef {
    expand: () => void;
    close: () => void;
}

interface Props {
    onClose: () => void;
    countries: ICountry[] | undefined;
}



const CountryList = memo(({ countries }: { countries: ICountry[] }) => {
    const keyExtractor = useCallback(
        (item: ICountry) => `${item.name}-${item.phone}`,
        []
    );
    
    const renderItem = useCallback(
        ({ item }: { item: ICountry }) => (
            <CountryCodeItem
                flag={item.flag}
                name={item.name}
                phone={item.phone}
            />
        ),
        []
    );
    
    return (
        <FlashList
            data={countries}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            drawDistance={200}
            removeClippedSubviews={true}
        />
    );
});

const CountyCodeBottomSheet = forwardRef<CountyCodeBottomSheetRef, Props>(
    ({ onClose, countries }, ref) => {
        const { t } = useTranslation();
        
        const snapPoints = ['70%'];
        
        const countyCodeBottomSheetRef = useRef<BottomSheet | null>(null);

        useImperativeHandle(ref, () => ({
            expand: () => {
                countyCodeBottomSheetRef.current?.expand();
            },
            close: () => {
                countyCodeBottomSheetRef.current?.close();
            }
        }), []);

        const handleCloseBottomSheet = useCallback(() => {
            countyCodeBottomSheetRef.current?.close();
        }, []);
        
        const countryData = useMemo(() => countries ?? [], [countries]);
        
        const selectCountryTitle = useMemo(() => t('Select Country Code'), [t]);

        return (
            <BottomSheet
                ref={countyCodeBottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                enablePanDownToClose={false}
                enableContentPanningGesture={false}
                onClose={onClose}
                animateOnMount={false}
                enableDynamicSizing={false}
            >
                <BottomSheetView className="flex-1 px-6 pt-2">
                    <BottomSheetHeader 
                        title={selectCountryTitle}
                        onClose={handleCloseBottomSheet}
                    />
                    
                    <BottomSheetView style={{ flex: 1 }}>
                        <CountryList countries={countryData} />
                    </BottomSheetView>
                </BottomSheetView>
            </BottomSheet>
        )
    }
);

CountyCodeBottomSheet.displayName = 'CountyCodeBottomSheet';

export default memo(CountyCodeBottomSheet);