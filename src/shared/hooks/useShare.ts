import { Share } from "react-native";
import { useCallback } from "react";

interface ShareOptions {
    message?: string;
    url: string;
    title?: string;
}

export const useShare = () => {
    const share = useCallback(async ({ message, url, title }: ShareOptions) => {
        try {
            const result = await Share.share({
                message: message || url,
                url,
                title,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared with activity type of result.activityType
                    return { success: true, activityType: result.activityType };
                } else {
                    // Shared
                    return { success: true };
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
                return { success: false, dismissed: true };
            }
        } catch (error) {
            console.error("Error sharing:", error);
            throw error;
        }
    }, []);

    return { share };
};