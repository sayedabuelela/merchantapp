import { Link } from 'expo-router';
import React from 'react'
import { Pressable, View } from 'react-native'
import FontText from '@/src/shared/components/FontText'
import { Route } from 'expo-router';

interface ServiceCardProps {
    title: string;
    description: string;
    href: Route;
    icon: React.ReactNode;
    onPress?: () => void;
}

const ServiceCard = ({ title, description, href, icon, onPress }: ServiceCardProps) => {
    return (
        <Link href={href} asChild>
            <Pressable onPress={onPress} className="min-w-[160px] p-4 rounded border border-tertiary bg-white/10 "
                style={{
                    shadowColor: '#fff',
                    shadowOffset: { width: -5, height: -5 },
                    shadowOpacity: 0.16,
                    shadowRadius: 2,
                    elevation: 2, // For Android
                }}
            >
                {icon && (
                    <View className='w-7 h-7 rounded-full bg-[#F1F6FF] p-1 items-center justify-center mb-2'>
                        {icon}
                    </View>
                )}
                <FontText
                    type="body"
                    weight="bold"
                    className='text-xs text-primary self-start mb-1'
                >{title}</FontText>
                <FontText
                    type="body"
                    weight="regular"
                    className='text-[10px] text-content-secondary self-start'
                >{description}</FontText>
            </Pressable>
        </Link>
    )
}

export default ServiceCard