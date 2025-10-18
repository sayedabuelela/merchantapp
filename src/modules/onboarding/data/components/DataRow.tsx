import FontText from "@/src/shared/components/FontText";
import { View } from "react-native";
interface DataRowProps {
    label: string;
    value?: string | null;
}

const DataRow = ({ label, value }: DataRowProps) => (
    value ? (
        <View className="flex-row items-center justify-between mb-4 ">
            <FontText type="body" weight="regular" className={` text-content-secondary text-sm mr-3 self-start`}>{label}</FontText>
            <FontText type="body" weight="semi" className={`shrink text-content-primary text-sm self-start ${label === 'Country' ? 'capitalize' : ''}`} numberOfLines={1}>{value}</FontText>
        </View>
    ) : null
);

export default DataRow;
