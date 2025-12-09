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

export const ENCRYPTION_KEY = 'e2070c4b4d582330d36b000de1a6d8c2'; // AES key (hex)
export const ENCRYPTION_IV = '4cedf7bd8763484f9557257b98f1f1c5'; // Initialization vector (hex)