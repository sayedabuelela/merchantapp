import { useApi } from "@/src/core/api/clients.hooks";
import { useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
export interface ICountry {
    flag: string;
    name: string;
    phone: string;
}
const getCountries = async (api: AxiosInstance): Promise<ICountry[]> => {
    const response = await api.get(`/v2/constants/countries`,)
    return response.data;
}

const useCountries = () => {
    const { api } = useApi();
    const { data: countries, isLoading } = useQuery<ICountry[], Error, ICountry[]>({
        queryKey: ['countries'],
        queryFn: () => getCountries(api),
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: (5 * 24 * 60 * 60) * 1000, // 5 days
    })
    return { countries, isLoading }
}

export default useCountries;