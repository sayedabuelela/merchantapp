import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InteractionManager, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const DEFAULT_LENGTH = 4;
const DIGIT_BOX_SIZE = 60;
const DIGIT_BOX_MARGIN = 16;
const INDICATOR_HEIGHT = 2;
const SHAKE_OFFSET = 5;

const COLOR_PRIMARY = '#3b82f6';
const COLOR_DEFAULT_BORDER = '#D5D9D9';
const COLOR_FOCUSED_BORDER = '#9ca3af';
const COLOR_ERROR = '#ef4444';
const COLOR_BACKGROUND = '#FDFDFD';
const COLOR_TEXT = '#111827';
const COLOR_PLACEHOLDER = '#6b7280';

const TIMING_CONFIG = { duration: 250 };
const SCALE_TIMING_CONFIG = { duration: 250 };
const SHAKE_TIMING_CONFIG = { duration: 50 };

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    autoFocus?: boolean;
    disabled?: boolean;
    showSeparator?: boolean;
    separatorCharacter?: string;
    separatorIndices?: number[];
    testID?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
    length = DEFAULT_LENGTH,
    value,
    onChange,
    onComplete,
    autoFocus = false,
    disabled = false,
    showSeparator = false,
    separatorCharacter = '-',
    separatorIndices = [Math.floor(length / 2) - 1],
    testID = 'otp-input',
}) => {
    const hiddenInputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [localError, setLocalError] = useState(false);

    const activeIndex = useSharedValue(0);
    const shakeTranslateX = useSharedValue(0);
    const isErrorSV = useSharedValue(0);

    const digitAnimValues = useRef(
        Array(length)
            .fill(0)
            .map(() => ({
                scale: useSharedValue(1),
                opacity: useSharedValue(0),
            }))
    ).current;

    const totalSeparators = showSeparator ? separatorIndices.length : 0;
    const separatorWidth = 20;
    const containerWidth =
        length * DIGIT_BOX_SIZE +
        (length - 1) * DIGIT_BOX_MARGIN +
        totalSeparators * separatorWidth;
    const boxFullWidth = DIGIT_BOX_SIZE + DIGIT_BOX_MARGIN;

    const handleComplete = useCallback(() => {
        if (onComplete) {
            onComplete(value);
        }
    }, [onComplete, value]);

    const triggerShake = useCallback(() => {
        setLocalError(true);
        isErrorSV.value = withTiming(1, { duration: 100 });
        shakeTranslateX.value = withSequence(
            withTiming(-SHAKE_OFFSET, SHAKE_TIMING_CONFIG),
            withTiming(SHAKE_OFFSET, SHAKE_TIMING_CONFIG),
            withTiming(-SHAKE_OFFSET, SHAKE_TIMING_CONFIG),
            withTiming(SHAKE_OFFSET, SHAKE_TIMING_CONFIG),
            withTiming(0, SHAKE_TIMING_CONFIG, (finished) => {
                if (finished) {
                    runOnJS(setLocalError)(false);
                    isErrorSV.value = withTiming(0, { duration: 400 });
                }
            })
        );
    }, [isErrorSV, shakeTranslateX]);

    useEffect(() => {
        if (autoFocus && hiddenInputRef.current) {
            if (Platform.OS === 'android') {
                const task = InteractionManager.runAfterInteractions(() => {
                    hiddenInputRef.current?.focus();
                });
                return () => task.cancel();
            } else {
                hiddenInputRef.current.focus();
            }
        }
    }, [autoFocus]);

    useEffect(() => {
        const currentLength = value.length;
        activeIndex.value = withTiming(currentLength, TIMING_CONFIG);

        digitAnimValues.forEach((anim, index) => {
            const shouldBeVisible = index < currentLength;
            const shouldAnimateScale = index === currentLength - 1;

            anim.opacity.value = withTiming(shouldBeVisible ? 1 : 0, TIMING_CONFIG);

            if (shouldAnimateScale) {
                anim.scale.value = withSequence(
                    withTiming(1.2, SCALE_TIMING_CONFIG),
                    withTiming(1, SCALE_TIMING_CONFIG)
                );
            } else {
                anim.scale.value = withTiming(1, SCALE_TIMING_CONFIG);
            }
        });

        if (currentLength === length) {
            runOnJS(handleComplete)();
            hiddenInputRef.current?.blur();
        }
    }, [value, length, activeIndex, digitAnimValues, handleComplete]);

    const handleInputChange = (text: string) => {
        if (disabled) return;

        const newValue = text.replace(/[^0-9]/g, '');

        if (text.length > 0 && newValue.length !== text.length && newValue.length < length) {
            runOnJS(triggerShake)();
            runOnJS(triggerShake)();
        }

        if (newValue.length <= length) {
            onChange(newValue);
        }
    };

    const handleKeyPress = ({ nativeEvent }: { nativeEvent: { key: string } }) => {
        if (disabled) return;
        if (nativeEvent.key === 'Backspace') {
        }
    };

    const handleFocus = () => {
        if (disabled) return;
        setIsFocused(true);
        activeIndex.value = withTiming(value.length, TIMING_CONFIG);
    };

    const handleBlur = () => {
        setIsFocused(false);
        isErrorSV.value = withTiming(0);
        setLocalError(false);
    };

    const handleContainerPress = () => {
        if (!disabled && hiddenInputRef.current) {
            hiddenInputRef.current.focus();
        }
    };

    const handleDigitPress = (index: number) => {
        if (!disabled && hiddenInputRef.current) {
            hiddenInputRef.current.focus();
            const newIndex = Math.min(index, value.length);
            activeIndex.value = withTiming(newIndex, TIMING_CONFIG);
        }
    };

    const containerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shakeTranslateX.value }],
        };
    });

    const indicatorAnimatedStyle = useAnimatedStyle(() => {
        let translateX = activeIndex.value * boxFullWidth;

        if (showSeparator) {
            let separatorsBefore = 0;
            for (const sepIndex of separatorIndices) {
                if (activeIndex.value > sepIndex) {
                    separatorsBefore++;
                }
            }
            translateX += separatorsBefore * separatorWidth;
        }

        const maxTranslateX = containerWidth - DIGIT_BOX_SIZE;
        const clampedTranslateX = Math.min(translateX, maxTranslateX);

        const targetOpacity = isFocused && activeIndex.value < length ? 1 : 0;

        return {
            transform: [{ translateX: translateX }],
            opacity: withTiming(targetOpacity, { duration: 150 }),
        };
    });

    const getDigitBoxAnimatedStyle = (index: number) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useAnimatedStyle(() => {
            const isActive = activeIndex.value === index && isFocused;

            const borderColor = interpolateColor(
                isErrorSV.value,
                [0, 1],
                [
                    isActive ? COLOR_PRIMARY : COLOR_DEFAULT_BORDER,
                    COLOR_ERROR,
                ]
            );

            return {
                borderWidth: isActive ? 0 : 2,
                borderRadius: isActive ? 0 : 8,
                borderColor: borderColor,
                transform: [{ scale: digitAnimValues[index].scale.value }],
            };
        });
    };

    const getDigitTextAnimatedStyle = (index: number) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useAnimatedStyle(() => {
            return {
                opacity: digitAnimValues[index].opacity.value,

            };
        });
    };

    const getPlaceholderAnimatedStyle = (index: number) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useAnimatedStyle(() => {
            const placeholderOpacity = interpolate(
                digitAnimValues[index].opacity.value,
                [0, 0.5],
                [1, 0],
                Extrapolate.CLAMP
            );
            return {
                opacity: placeholderOpacity,
            };
        });
    };


    return (
        <View style={styles.outerContainer} testID={testID}>
            <TextInput
                ref={hiddenInputRef}
                style={styles.hiddenInput}
                value={value}
                onChangeText={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={handleFocus}
                onBlur={handleBlur}
                keyboardType="number-pad"
                maxLength={length}
                caretHidden
                autoFocus={autoFocus}
                selectionColor="transparent"
                editable={!disabled}
                testID={`${testID}-hidden-input`}
            />

            <Pressable
                style={styles.pressableContainer}
                onPress={handleContainerPress}
                disabled={disabled}
                testID={`${testID}-pressable-container`}
            >
                <Animated.View style={[styles.boxesContainer, { width: containerWidth }, containerAnimatedStyle]}>
                    {Array.from({ length }).map((_, index) => {
                        const digit = value[index] || '';
                        const isCurrent = index === value.length;
                        const showDigit = digit !== '';
                        const needsSeparatorAfter = showSeparator && separatorIndices.includes(index) && index < length - 1;

                        return (
                            <React.Fragment key={`digit-fragment-${index}`}>
                                <Pressable
                                    onPress={() => handleDigitPress(index)}
                                    disabled={disabled}
                                    style={styles.digitPressable}
                                    testID={`${testID}-digit-${index}`}
                                >
                                    <Animated.View
                                        style={[
                                            styles.digitBox,
                                            getDigitBoxAnimatedStyle(index),
                                        ]}
                                    >
                                        <Animated.View
                                            style={[styles.placeholderContainer, getPlaceholderAnimatedStyle(index)]}>
                                            <View style={styles.placeholderDot} />
                                        </Animated.View>

                                        <Animated.Text
                                            style={[
                                                styles.digitText,
                                                getDigitTextAnimatedStyle(index),
                                            ]}
                                        >
                                            {digit}
                                        </Animated.Text>
                                    </Animated.View>
                                </Pressable>
                                {needsSeparatorAfter && (
                                    <View style={styles.separatorContainer} testID={`${testID}-separator-${index}`}>
                                        <Text style={styles.separatorText}>{separatorCharacter}</Text>
                                    </View>
                                )}
                            </React.Fragment>
                        );
                    })}

                    <Animated.View
                        style={[styles.indicator, indicatorAnimatedStyle, localError && { borderColor: COLOR_ERROR }]} />
                </Animated.View>
            </Pressable>

            {localError && (
                <Text style={styles.errorText} testID={`${testID}-error-text`}>
                    Please enter only numbers.
                </Text>
            )}
        </View>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    outerContainer: {
        alignItems: 'center',
        position: 'relative',
    },
    pressableContainer: {
    },
    boxesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
        height: DIGIT_BOX_SIZE + INDICATOR_HEIGHT + 4,
        marginBottom: 10,
    },
    digitPressable: {
        width: DIGIT_BOX_SIZE,
        height: DIGIT_BOX_SIZE,
        marginRight: DIGIT_BOX_MARGIN,
    },
    digitBox: {
        width: DIGIT_BOX_SIZE,
        height: DIGIT_BOX_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLOR_BACKGROUND,
        position: 'relative',
        overflow: 'hidden',
    },
    digitText: {
        fontSize: 24,
        fontWeight: '600',
        color: COLOR_TEXT,
        textAlign: 'center',
    },
    placeholderContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLOR_PLACEHOLDER,
    },
    indicator: {
        position: 'absolute',
        bottom: 3,
        left: 0,
        width: DIGIT_BOX_SIZE,
        height: DIGIT_BOX_SIZE,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: COLOR_PRIMARY,
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
        // Remove: top: -1000
        // Add these instead:
        top: 0,
        left: 0,
        zIndex: -1,
    },
    separatorContainer: {
        height: DIGIT_BOX_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: DIGIT_BOX_MARGIN,
    },
    separatorText: {
        fontSize: 20,
        color: COLOR_PLACEHOLDER,
    },
    errorText: {
        color: COLOR_ERROR,
        marginTop: 5,
        fontSize: 12,
        textAlign: 'center',
    },
});

export default React.memo(
    OtpInput,
    (prev, next) =>
        prev.value === next.value &&
        prev.disabled === next.disabled &&
        prev.length === next.length
);
