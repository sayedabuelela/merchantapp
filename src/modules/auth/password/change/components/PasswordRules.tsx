import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, MotiView } from 'moti';
interface PasswordRulesProps {
    checks: {
        length: boolean;
        uppercase: boolean;
        lowercase: boolean;
        number: boolean;
        special: boolean;
    }
}
const PasswordRules = ({ checks }: PasswordRulesProps) => {
    const { t } = useTranslation();
    return (
        <AnimatePresence>
            <MotiView
                key="error-message"
                from={{
                    opacity: 0,
                    translateY: 10
                }}
                animate={{
                    opacity: 1,
                    translateY: 0
                }}
                exit={{
                    opacity: 0,
                    translateY: 10
                }}
                transition={{
                    type: 'timing',
                    duration: 600
                }}
                className="bg-[#F1F6FF] p-3 rounded-md border border-[#A8C4FF] mt-6">
                <FontText
                    type='body'
                    weight='bold'
                    className="text-content-secondary mb-3 text-sm">
                    {t('These are instructions about how your password should be:')}
                </FontText>
                {[
                    { label: t('Password must be at least 8 characters'), ok: checks.length },
                    { label: t('One capital letter & one small letter at least'), ok: checks.uppercase && checks.lowercase },
                    { label: t('Use at least one number in your password'), ok: checks.number },
                    { label: t('Add at least one special character ( @#$%!- ) in your password'), ok: checks.special },
                ].map((item, i) => (
                    <View key={i} className="flex-row items-center mb-2">
                        <Ionicons
                            name={item.ok ? 'checkmark-circle' : 'ellipse-outline'}
                            size={14}
                            color={item.ok ? '#388E3B' : '#556767'}
                        />
                        <FontText
                            type='body'
                            weight='semi'
                            className={`ml-2 text-sm ${item.ok ? 'text-[#388E3B] line-through' : 'text-content-secondary'}`}>
                            {item.label}
                        </FontText>
                    </View>
                ))}
            </MotiView>
        </AnimatePresence>
    )
}

export default PasswordRules