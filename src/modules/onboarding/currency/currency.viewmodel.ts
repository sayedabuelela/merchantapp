import { useApi } from "@/src/core/api/clients.hooks";
import { ROUTES } from "@/src/core/navigation/routes";
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import { getOnboardingAllData } from "@/src/modules/onboarding/data/onboarding-data.service";
import { accountTypeSelector, useOnboardingStore } from "@/src/modules/onboarding/onboarding.store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GlobalOnboardingData } from "../data/onboarding-data.model";
import useOnboardingDataViewModel from "../data/onboarding-data.viewmodel";
import { Currency } from "./currency.model";
const useCurrencyViewModel = () => {
    const router = useRouter();
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const currentMerchantId = user?.merchantId;
    const accountType = useOnboardingStore(accountTypeSelector);
    const [selectedCurrencies, setSelectedCurrencies] = useState<Currency[]>([]);

    const handleCurrencyChange = (currency: Currency) => {
        setSelectedCurrencies((prev) => {
            const existingCurrencyIndex = prev.findIndex((item) => item.name === currency.name);
            if (existingCurrencyIndex !== -1) {
                return prev.filter((_, index) => index !== existingCurrencyIndex);
            } else {
                return [...prev, currency];
            }
        });
    };
    
    const staticCurrencies : Currency[] = useMemo(() => {
        return accountType === 'registered' 
            ? [
                { name: 'EGP', status: "pending" },
                { name: 'EUR', status: "pending" },
                { name: 'USD', status: "pending" },
                { name: 'GBP', status: "pending" },
              ] 
            : [{ name: 'EGP', status: "pending" }];
    }, [accountType]);

    const { onboardingDataQueryKey, submitPartialData, isSubmittingPartialData } = useOnboardingDataViewModel();
    const {
        data: currencyData,
        isLoading: isLoadingCurrencyData,
        error: currencyDataError,
        isFetching: isFetchingCurrencyData,
    } = useQuery<GlobalOnboardingData, Error, Currency[] | undefined>({
        queryKey: onboardingDataQueryKey,
        queryFn: () => currentMerchantId ?
            getOnboardingAllData(api, currentMerchantId) :
            Promise.reject(new Error("No merchant ID available")),
        select: (allFetchedData) => {
            return allFetchedData?.merchant?.merchantInfo?.payoutMethod?.currencies;
        },
        enabled: !!currentMerchantId,
        staleTime: 20 * 60 * 1000, // 20 minutes,
        // staleTime: Infinity,
    });

    useEffect(() => {
        if (currencyData) {
            setSelectedCurrencies(currencyData.length ? currencyData : [{
                "name": "EGP",
                "status": "pending"
            }]);
        }
    }, [currencyData]);

    const submitCurrencyData = useCallback(async (currencies: Currency[]) => {
        await submitPartialData({
            merchantInfo: {
                payoutMethod: {
                    currencies
                }
            }
        });
        router.push(ROUTES.ONBOARDING.DATA);
    }, [submitPartialData]);

    return {
        currencyData,
        isLoadingCurrencyData,
        currencyDataError,
        isFetchingCurrencyData,
        submitCurrencyData,
        isSubmittingPartialData,
        staticCurrencies,
        selectedCurrencies,
        handleCurrencyChange,
    }
}

export default useCurrencyViewModel
