import { useState, useCallback, useRef, useEffect } from "react";
import * as Clipboard from "expo-clipboard";

export const useClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const copy = useCallback(async (text: string) => {
        try {
            await Clipboard.setStringAsync(text);
            setIsCopied(true);

            // Clear existing timeout if any
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Reset state after 2 seconds
            timeoutRef.current = setTimeout(() => {
                setIsCopied(false);
                timeoutRef.current = null;
            }, 2000);
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            throw error;
        }
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { copy, isCopied };
};