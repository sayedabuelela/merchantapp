
import { z } from "zod";

export const businessScheme = z.object({
    businessLogo: z.union([
        z.object({
            uri: z.string(),
            name: z.string(),
            type: z.string(),
            size: z.number().optional(),
        }),
        z.string(),
    ]).optional(),
    legalCompanyName: z.string().min(1, 'Business name is required'),
    storeName: z.string().min(1, 'Business name is required'),
    description: z.string().optional(),
    businessIndustry: z.string().min(1, 'Business Industry is required'),
    businessSector: z.string().min(1, 'Business Sector is required'),
    companyWebsite: z.string().optional(),
    socialTwitter: z.string().optional(),
    socialLinkedIn: z.string().optional(),
    socialFacebook: z.string().optional(),
    socialInstagram: z.string().optional(),
    termsAndConditions: z.object({
        ar: z.string().min(1, 'Terms and conditions is required'),
        en: z.string().min(1, 'Terms and conditions is required'),
    })
})

// {
//     merchantAccountType: accountType,
//     publicData: {
//         legalCompanyName,
//         storeName,
//         description,
//         businessIndustry: businessSector,
//         // businessSector,
//         companyWebsite,
//         socialTwitter,
//         socialLinkedIn,
//         socialFacebook,
//         socialInstagram,
//         termsAndConditions: {ar: termsAr, en: termsEn},
//     }