import FontText from "@/src/shared/components/FontText";
import { Pressable } from "react-native";
import SimpleLoader from "@/src/shared/components/loaders/SimpleLoader";
import { cn } from "@/src/core/utils/cn";
interface Props {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
    isLoading?: boolean;
    variant?: 'default' | 'danger';
}
const ActionItem = ({ title, icon, onPress, isLoading, variant = 'default' }: Props) => {
    return (
        <Pressable onPress={onPress} className={cn("flex-row items-center gap-x-2 border border-[#D9E5FF] rounded p-4", (variant === 'danger') && 'border-stroke-feedback-danger bg-feedback-error-bg')} disabled={isLoading}>
            {isLoading ? <SimpleLoader /> : (
                <>
                    {icon}
                    <FontText type="body" weight="regular" className={cn('text-primary text-base self-start ml-1', isLoading && 'text-content-secondary/40', (variant === 'danger') && 'text-feedback-error')}>{title}</FontText>
                </>
            )}
        </Pressable>
    )
}

export default ActionItem