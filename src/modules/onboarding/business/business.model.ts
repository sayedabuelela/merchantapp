import { BusinessLogoMetadata } from "@/src/modules/onboarding/documents/documents.model";
import { z } from "zod";
import { AccountType } from "../account-type/account-type.model";
import { businessScheme } from "./business.scheme";

export type BusinessDetailsFormData = z.infer<typeof businessScheme>;

export type BusinessDetailsRequestData = {
    merchantInfo: {
        merchantAccountType: AccountType;
        publicData: Omit<BusinessDetailsFormData, 'businessLogo' | 'businessSector'> & {
            businessLogo?: BusinessLogoMetadata;
            businessSector?: string;
        }
    },
}


export interface BusinessInfoErrors {
    businessName?: string;
    businessType?: string;
    businessAddress?: string;
    taxId?: string;
}


export interface BusinessSector {
    en: string;
    ar: string;
    value: string;
}

export interface BusinessIndustry {
    id: number;
    en: string;
    ar: string;
    sectors: BusinessSector[];
}

export type BusinessIndustries = BusinessIndustry[];