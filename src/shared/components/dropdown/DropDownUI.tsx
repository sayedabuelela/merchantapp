import FontText from "@/src/shared/components/FontText";
import { Pressable } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import * as DropdownMenu from 'zeego/dropdown-menu';

export interface DropDownOption<T> {
    label: string;
    value: T;
}

interface DropDownUIProps<T> {
    options: DropDownOption<T>[];
    selected?: T;
    placeholder?: string;
    onChange: (value: T) => void;
}

const DropDownUI = <T extends string | number>({
    options,
    selected,
    placeholder = "Select option",
    onChange,
}: DropDownUIProps<T>) => {
    const selectedLabel =
        options.find((opt) => opt.value === selected)?.label ?? placeholder;

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
                {options.map((opt) => (
                    <DropdownMenu.Item
                        key={String(opt.value)}
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
