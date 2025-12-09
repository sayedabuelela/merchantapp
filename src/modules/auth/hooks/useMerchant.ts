import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, selectUpdateUser, selectUser, selectUpdateToken } from '@/src/modules/auth/auth.store';
import { getMerchant } from '@/src/modules/auth/login/login.service';
import { useApi } from '@/src/core/api/clients.hooks';
import { AxiosInstance } from 'axios';
import { User } from '@/src/modules/auth/auth.model';
import { useToast } from '@/src/core/providers/ToastProvider';

export const fetchAndSyncMerchant = async (api: AxiosInstance, updateUser: (user: Partial<User>) => void) => {
    const data = await getMerchant(api);
    console.log("fetchAndSyncMerchant data : ", data.body);
    updateUser({
        _id: data.body._id,
        belongsToMerchants: data.body.belongsToMerchants,
        mobileNumber: data.body.mobileNumber,
        countryCode: data.body.countryCode,
        countLoginAttemps: data.body.countLoginAttemps,
        fullName: data.body.fullName,
        notifications: data.body.notifications,
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
    const { api } = useApi();
    const { showToast } = useToast?.() ?? { showToast: () => { } };

    const mutation = useMutation({
        mutationFn: async (merchantId: string) => {
            // POST or GET depending on API; you used POST in your code.
            const { data } = await api.post(`/v2/identity/switch-business?merchantId=${merchantId}`);
            return data;
        },
        onSuccess: async (data, merchantId) => {
            // 1) Update token (if server returns one)
            const newToken = data?.accessToken?.token ?? data?.accessToken;
            if (newToken) {
                updateToken(newToken);
                // setApiAuthToken(newToken); // ensure axios uses it from now on
            }

            // 2) Update user minimal fields immediately (merchantId, isLive, actions)
            updateUser({
                merchantId,
                isLive: data?.isLive,
                actions: data?.actions,
            });

            // 3) Fetch & sync full merchant data using centralized function — ensures updateUser merges the server data
            try {
                await queryClient.fetchQuery({
                    queryKey: ['merchantData', merchantId],
                    queryFn: () => fetchAndSyncMerchant(api, updateUser),
                });
            } catch (err) {
                console.warn('Failed to fetch merchant data after switch', err);
            }

            // 4) Invalidate dependent queries (payment links, balances, etc.)
            queryClient.invalidateQueries({ queryKey: ['payment-links'] });
            queryClient.invalidateQueries({ queryKey: ['merchantData'], exact: false }); // refetch merchantData if needed
            queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false }); // example

            // optional UX
            showToast?.({ message: 'Switched store successfully', type: 'info' });
        },
        onError: (err) => {
            console.error('Switch merchant failed:', err);
            showToast?.({ message: 'Failed to switch store', type: 'danger' });
        }
    });

    return {
        switchMerchant: mutation.mutateAsync,
        isSwitchLoading: mutation.isPending,
        switchError: mutation.error,
    };
};