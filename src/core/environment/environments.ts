import Constants from 'expo-constants';
export enum Environment {
    STAGING = 'staging',
    PRODUCTION = 'production'
}

export enum Mode {
    TEST = 'test',
    LIVE = 'live'
}

export const BASE_URLS = {
    [Environment.STAGING]: {
        [Mode.LIVE]: 'https://api.staging.payformance.io',
        [Mode.TEST]: 'https://test-api.staging.payformance.io'
    },
    [Environment.PRODUCTION]: {
        [Mode.LIVE]: 'https://api.kashier.io',
        [Mode.TEST]: 'https://test-api.kashier.io'
    }
}

export const PAYMENT_URLS = {
    [Environment.STAGING]: {
        [Mode.LIVE]: 'https://fep.staging.payformance.io',
        [Mode.TEST]: 'https://test-fep.staging.payformance.io'
    },
    [Environment.PRODUCTION]: {
        [Mode.LIVE]: 'https://fep.kashier.io',
        [Mode.TEST]: 'https://test-fep.kashier.io'
    }
}

export const SHARE_URLS = {
    [Environment.STAGING]: 'https://merchant.staging.payformance.io',
    [Environment.PRODUCTION]: 'https://merchant.kashier.io'
}

export const CHECKOUT_URL = 'https://checkouts.kashier.io'
export const FRESH_DISK_URL = 'https://kashierps.freshdesk.com'


// Read from environment variables via expo-constants
export const ENCRYPTION_KEY = Constants.expoConfig?.extra?.encryptionKey || '';
export const ENCRYPTION_IV = Constants.expoConfig?.extra?.encryptionIV || '';