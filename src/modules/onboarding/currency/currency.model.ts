import { ApprovalStatus } from "../data/onboarding-data.model";

export type CurrencyRequestData = {
    merchantInfo: {
        payoutMethod: {
            currencies: Currency[]
        }
    },
}

export type Currency = {
    id?: string;
    name: "EGP" | "USD" | string;
    status: ApprovalStatus;
}