import FontText from "@/src/shared/components/FontText";
import { Pressable, TouchableOpacity, View } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import * as DropdownMenu from 'zeego/dropdown-menu';
import { DownArrow } from "@/src/shared/assets/svgs";
import { cn } from "@/src/core/utils/cn";

export interface DropDownOption<T> {
    label: string;
    value: T;
}

interface DropDownUIProps<T> {
    options: DropDownOption<T>[];
    selected?: T;
    placeholder?: string;
    onChange: (value: T) => void;
    dropdownKey?: string; // Optional for backward compatibility
    variant?: 'default' | 'filter';
    label?: string;
    icon?: React.ReactNode;
}

const DropDownUI = <T extends string | number | boolean | null | undefined>({
    options,
    selected,
    placeholder = "Select option",
    onChange,
    dropdownKey = 'dropdown',
    variant = 'default',
    icon,
    label
}: DropDownUIProps<T>) => {
    const selectedOption = options.find((opt) => opt.value === selected);
    const selectedLabel = selectedOption?.label ?? placeholder;
    const isSelected = selectedOption !== undefined;

    if (variant === 'filter') {
        return (
            <View>
                {label && (
                    <FontText
                        type="body"
                        weight="semi"
                        className="text-sm text-content-secondary mb-2 self-start"
                    >
                        {label}
                    </FontText>
                )}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <TouchableOpacity className="w-full flex-row items-center justify-between px-3 h-11 bg-white border rounded border-stroke-input mb-3">
                            <View className="flex-row items-center">
                                {icon}
                                <FontText
                                    type="body"
                                    weight="regular"
                                    className={cn(
                                        "text-sm",
                                        isSelected ? "text-content-primary" : "text-placeholder-color",
                                        icon && "ml-2"
                                    )}
                                >
                                    {selectedLabel}
                                </FontText>
                            </View>
                            <ChevronDownIcon size={24} color="#556767" />
                        </TouchableOpacity>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content>
                        <DropdownMenu.Label />
                        {options.map((opt, index) => (
                            <DropdownMenu.Item
                                key={`${dropdownKey}-${index}`}
                                onSelect={() => onChange(opt.value)}
                            >
                                <DropdownMenu.ItemTitle>{opt.label}</DropdownMenu.ItemTitle>
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </View>
        );
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Pressable className="flex-row items-center">
                    <FontText
                        type="body"
                        weight="regular"
                        className="text-base text-primary"
                    >
                        {selectedLabel}
                    </FontText>
                    <ChevronDownIcon size={20} color="#001F5F" />
                </Pressable>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                {options.map((opt, index) => (
                    <DropdownMenu.Item
                        key={`${dropdownKey}-${index}`}
                        onSelect={() => onChange(opt.value)}
                    >
                        <DropdownMenu.ItemTitle>{opt.label}</DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}

export default DropDownUI;
