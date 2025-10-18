import { z } from "zod";
import { businessContactScheme } from "./contact.scheme";

export type BusinessContactFormData = z.infer<typeof businessContactScheme>;

export type BusinessContactRequestData = {
    merchantInfo: {
        businessContactInfo: BusinessContactFormData
    },
}



export type City = {
    id: string;
    value: string;
    city_name_ar: string;
    city_name_en: string;
    governorate_id: string;
}
