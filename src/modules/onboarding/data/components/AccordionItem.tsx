import { cn } from '@/src/core/utils/cn';
import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import Feather from '@expo/vector-icons/Feather';
import { Route, router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

const AnimatedView = Animated.View;

interface AccordionItemProps {
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
}

const AccordionItem: React.FC<AccordionItemProps> = React.memo(({
    title,
    children,
    initiallyOpen = false,
    // containerClassName = "bg-surface-secondary mb-3 rounded-[5px] mt-2 mx-safe-offset-1 shadow-[0px_0px_5px_0px_#00000040]",
    containerClassName = "my-2 rounded mx-safe-offset-1 border border-stroke-main",
    headerClassName = "",
    titleClassName = "text-content-primary text-xl self-start",
    contentWrapperClassName = "",
    contentInternalContainerClassName = "pt-2 pb-4 px-4",
    editRoute,
}) => {
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
            className={containerClassName}
            layout={LinearTransition.duration(250)}
        >
            <TouchableOpacity
                onPress={toggleOpen}
                className={cn('flex-row justify-between items-center p-4 rounded-[5px]', headerClassName, isOpen ? "rounded-b-none" : "rounded-b-[5px]")}
            >
                <FontText type="head" weight="regular" className={titleClassName}>{title}</FontText>
                <View className="flex-row items-center">
                    <MotiView
                        animate={{ rotate: isOpen ? '180deg' : '0deg' }}
                        transition={{ type: 'timing', duration: 200 }}
                    >
                        <Feather name="chevron-down" size={24} color="#202020" />
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
                        <Button variant="outline" title="Edit" onPress={handleEdit} />
                    </View>
                </AnimatedView>
            )}
        </AnimatedView>
    );
});

export default AccordionItem;