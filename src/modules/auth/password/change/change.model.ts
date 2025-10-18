// export interface ChangePasswordRequest {
//     currentPassword: string;
//     newPassword: string;
// }

import { z } from "zod";
import { changePasswordSchema } from "./change.scheme";

export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;

export interface ChangePasswordResponse {
    message: string;
}