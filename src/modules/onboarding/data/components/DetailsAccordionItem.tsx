import { cn } from '@/src/core/utils/cn';
import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import Feather from '@expo/vector-icons/Feather';
import { Route, router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon } from 'react-native-heroicons/outline';

const AnimatedView = Animated.View;

interface DetailsAccordionItemProps {
    title: string;
    children: React.ReactNode;
    initiallyOpen?: boolean;
    editButton?: React.ReactNode;
    containerClassName?: string;
    headerClassName?: string;
    titleClassName?: string;
    contentWrapperClassName?: string;
    contentInternalContainerClassName?: string;
    editRoute?: Route;
    showEditButton?: boolean;
}

const DetailsAccordionItem: React.FC<DetailsAccordionItemProps> = React.memo(({
    title,
    children,
    initiallyOpen = false,
    // containerClassName = "bg-surface-secondary mb-3 rounded-[5px] mt-2 mx-safe-offset-1 shadow-[0px_0px_5px_0px_#00000040]",
    containerClassName,
    headerClassName = "",
    titleClassName,
    contentWrapperClassName = "",
    contentInternalContainerClassName = "pt-2 gap-y-2",
    editRoute,
    showEditButton = true,
}) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleEdit = () => {
        if (editRoute) {
            router.push(editRoute);
        }
    }
    return (
        <AnimatedView
            className={cn("p-4 rounded border border-tertiary mt-8", containerClassName)}
            layout={LinearTransition.duration(250)}
        >
            <TouchableOpacity
                onPress={toggleOpen}
                className={cn('flex-row justify-between items-center ', headerClassName, isOpen ? "pb-2 mb-2 border-b border-b-tertiary" : "")}
            >
                <FontText type="body" weight="bold" className={cn("text-content-secondary text-base self-start", titleClassName)}>{title}</FontText>
                <View className="flex-row items-center">
                    <MotiView
                        animate={{ rotate: isOpen ? '180deg' : '0deg' }}
                        transition={{ type: 'timing', duration: 200 }}
                    >
                        <ChevronDownIcon size={20} color="#001F5F" />
                    </MotiView>
                </View>
            </TouchableOpacity>

            {isOpen && (
                <AnimatedView
                    entering={FadeIn.duration(200).delay(50)}
                    exiting={FadeOut.duration(200)}
                    style={{ overflow: 'hidden' }}
                    className={cn(contentWrapperClassName)}
                >
                    <View className={contentInternalContainerClassName}>
                        {children}
                        {showEditButton && editRoute && (
                            <Button variant="outline" title={t('Edit')} onPress={handleEdit} />
                        )}
                    </View>
                </AnimatedView>
            )}
        </AnimatedView>
    );
});

export default DetailsAccordionItem;