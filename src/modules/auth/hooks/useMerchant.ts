import { useQuery } from '@tanstack/react-query';
import { useAuthStore, selectUpdateUser, selectUser, selectUpdateToken } from '@/src/modules/auth/auth.store';
import { getMerchant } from '@/src/modules/auth/login/login.service';
import { useApi } from '@/src/core/api/clients.hooks';
import { AxiosInstance } from 'axios';
import { User } from '@/src/modules/auth/auth.model';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const fetchAndSyncMerchant = async (api: AxiosInstance, updateUser: (user: Partial<User>) => void) => {
    const data = await getMerchant(api);
    // console.log("fetchAndSyncMerchant data : ", data.body);
    updateUser({
        belongsToMerchants: data.body.belongsToMerchants,
        mobileNumber: data.body.mobileNumber,
        countryCode: data.body.countryCode,
        countLoginAttemps: data.body.countLoginAttemps,
    });
    return data;
};

export const useMerchant = () => {
    const { api } = useApi();
    const updateUser = useAuthStore(selectUpdateUser);
    const user = useAuthStore(selectUser);

    const merchantId = user?.merchantId;

    return useQuery({
        queryKey: ['merchantData', merchantId],
        queryFn: () => fetchAndSyncMerchant(api, updateUser),
        enabled: !!merchantId,
        staleTime: 1000 * 60 * 24, // 24 hours
    });
};

export const useSwitchMerchantId = () => {
    const queryClient = useQueryClient();
    const updateUser = useAuthStore(selectUpdateUser);
    const updateToken = useAuthStore(selectUpdateToken);

    // const setUser = useAuthStore((s) => s.setUser);
    const { api } = useApi();

    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: async (merchantId: string) => {
            const { data } = await api.post(`/v2/identity/switch-business?merchantId=${merchantId}`);
            return data;
        },
        onSuccess: (data, merchantId) => {
            // console.log("merchantId : ", merchantId);
            // console.log("useSwitchMerchantId data : ", data.accessToken.token);
            updateUser({ merchantId, actions: data.actions, isLive: data.isLive});
            updateToken(data.accessToken.token);
            queryClient.invalidateQueries({ queryKey: ["payment-links"] });
            // queryClient.invalidateQueries({ queryKey: ['merchantData', merchantId] });
            // queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Switch merchant failed:', error);
        },
    });
    return {
        switchMerchant: mutateAsync,
        isSwitchLoading: isPending,
        switchMerchantError: error
    }
};