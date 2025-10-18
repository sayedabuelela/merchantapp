import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const fileSchema = z.object({
    uri: z.string().min(1, "File URI is required"),
    name: z.string().min(1, "File name is required"),
    type: z.string(),
    size: z.number().optional().refine(
        (size) => !size || size <= MAX_FILE_SIZE,
        `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    ),
});

export const imageSchema = fileSchema.extend({
    type: z.string().refine(
        (type) => ACCEPTED_IMAGE_TYPES.includes(type),
        `Image must be one of the following types: ${ACCEPTED_IMAGE_TYPES.join(', ')}`
    ),
});

export const documentSchema = fileSchema.extend({
    type: z.string().refine(
        (type) => ACCEPTED_DOCUMENT_TYPES.includes(type),
        `Document must be one of the following types: ${ACCEPTED_DOCUMENT_TYPES.join(', ')}`
    ),
});

export type FileSchema = z.infer<typeof fileSchema>;
export type ImageSchema = z.infer<typeof imageSchema>;
export type DocumentSchema = z.infer<typeof documentSchema>;

export const uploadFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    image: imageSchema.nullable().optional(),
    document: documentSchema.nullable().optional(),
}).refine(
    (data) => data.image !== null || data.document !== null,
    {
        message: "At least one file (image or document) must be uploaded",
        path: ["files"]
    }
);

export type UploadFormData = z.infer<typeof uploadFormSchema>;