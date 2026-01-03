
import { z } from "zod";
const urlRegex = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?$/;

const optionalUrl = z.string().trim().refine(
    (val) => !val || urlRegex.test(val),
    'Please enter a valid URL'
).optional();

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
    legalCompanyName: z.string().trim().min(1, 'This field is required'),
    storeName: z.string().trim().min(1, 'This field is required'),
    description: z.string().trim().optional(),
    businessIndustry: z.string().trim().min(1, 'Business Industry is required'),
    businessSector: z.string().trim().min(1, 'Business Sector is required'),
    companyWebsite: optionalUrl,
    socialTwitter: optionalUrl,
    socialLinkedIn: optionalUrl,
    socialFacebook: optionalUrl,
    socialInstagram: optionalUrl,
    termsAndConditions: z.object({
        ar: z.string().trim().min(1, 'Terms and conditions is required'),
        en: z.string().trim().min(1, 'Terms and conditions is required'),
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