import axios, {AxiosInstance} from "axios";
import {addAuthInterceptor, addErrorInterceptor} from "@/src/core/api/clients.interceptors";
import {BASE_URLS, Environment, PAYMENT_URLS, Mode} from "@/src/core/environment/environments";

const createBaseClient = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'client-type': 'merchantApp'
        },
        timeout: 30000, // 30 seconds timeout
    })

    addAuthInterceptor(instance)
    addErrorInterceptor(instance)

    return instance
}

export const createApiClient = (environment: Environment, mode: Mode): AxiosInstance => {
    const baseURL = BASE_URLS[environment][mode]
    // console.log('baseURL', baseURL)
    return createBaseClient(baseURL)
}

export const createPaymentApiClient = (environment: Environment, mode: Mode): AxiosInstance => {
    const baseURL = PAYMENT_URLS[environment][mode]
    return createBaseClient(baseURL)
}
