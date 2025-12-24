import FontText from '@/src/shared/components/FontText';
import React, { createContext, useCallback, useContext, useState, useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';

type ToastType = 'info' | 'warning' | 'danger' | 'success';

interface ToastConfig {
    message: string;
    type?: ToastType;
    duration?: number;
}

interface ToastContextProps {
    showToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastConfig | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    const hideToast = useCallback(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 20, duration: 200, useNativeDriver: true }),
        ]).start(() => setToast(null));
    }, [fadeAnim, translateY]);

    const showToast = useCallback(
        ({ message, type = 'info', duration = 3000 }: ToastConfig) => {
            setToast({ message, type, duration });
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]).start();

            const timer = setTimeout(() => hideToast(), duration);
            return () => clearTimeout(timer);
        },
        [fadeAnim, translateY, hideToast]
    );

    useEffect(() => {
        return () => fadeAnim.stopAnimation();
    }, [fadeAnim]);

    const getToastStyle = (type: ToastType) => {
        switch (type) {
            case 'warning':
                return 'bg-[#FFF7E8] border-[#FFD484]';
            case 'danger':
                return 'bg-[#FFEAED] border-[#FFBBC4]';
            case 'info':
                return 'bg-[#F1F6FF] border-[#C0D5FF]';
            case 'success':
                return 'bg-[#F3FFF4] border-[#1A541D]';
            default:
                return 'bg-[#F3FFF4] border-[#1A541D]';
        }
    };

    const getTextColor = (type: ToastType) => {
        switch (type) {
            case 'warning':
                return 'text-[#1A541D]';
            case 'danger':
                return 'text-[#A50017]';
            case 'info':
                return 'text-[#001F5F]';
            case 'success':
                return 'text-[#28712B]';
            default:
                return 'text-[#28712B]';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {toast && (
                <Animated.View
                    className="absolute top-16 left-4 right-4 z-50"
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY }],
                    }}
                >
                    <TouchableOpacity activeOpacity={0.9} onPress={hideToast}>
                        <View
                            className={`border px-4 py-3 rounded ${getToastStyle(
                                toast.type || 'info'
                            )}`}
                        >
                            <FontText
                                type="body"
                                weight="regular"
                                className={`${getTextColor(toast.type || 'info')} self-start`}
                            >
                                {toast.message}
                            </FontText>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            )}
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
