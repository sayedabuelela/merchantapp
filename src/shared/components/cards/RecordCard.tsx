import { ReactNode } from 'react';
import { I18nManager, View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';

const isRTL = I18nManager.isRTL;

/**
 * Explicit line heights, with headroom: FontText scales a mapped size class by
 * 1.0-1.125 on device width. The RTL values clear NotoNaskhArabic's taller
 * metrics without FontText's blanket 1.8x multiplier, which an inline style
 * overrides. Note the `leading-*` escape hatch would NOT work here — FontText
 * matches /\bleading-\d+\b/, so bracket syntax like leading-[14px] is ignored.
 */
const LH = {
    title: isRTL ? 22 : 18,
    sub: isRTL ? 20 : 16,
    chip: isRTL ? 16 : 13,
    meta: isRTL ? 16 : 13,
};

/**
 * RN auto-flips flexDirection and alignItems under forceRTL but never textAlign,
 * so start-alignment has to be resolved by hand — otherwise a title stretched by
 * `flex-1` paints at the column's left edge and drifts away from the card edge.
 * Mirror of END_ALIGN in shared/components/details-screens/SectionRowItem.tsx.
 */
const START_ALIGN = { textAlign: isRTL ? 'right' : 'left' } as const;

/** A machine reference: transaction id, order number, item count. */
export const RecordChip = ({
    children,
    uppercase,
    className,
}: {
    children: ReactNode;
    uppercase?: boolean;
    className?: string;
}) => {
    if (children === null || children === undefined || children === '') return null;
    return (
        <View
            className={cn(
                'bg-tertiary rounded-[2px] px-1 py-0.5 shrink min-w-0 overflow-hidden',
                className
            )}
        >
            <FontText
                type="body"
                weight="regular"
                className={cn('text-content-secondary text-xxs', uppercase && 'uppercase')}
                style={{ lineHeight: LH.chip, ...START_ALIGN }}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {children}
            </FontText>
        </View>
    );
};

/** One entry in the bottom customer strip: small icon + label. */
export const RecordMetaItem = ({
    icon,
    children,
}: {
    icon?: ReactNode;
    children: ReactNode;
}) => {
    if (children === null || children === undefined || children === '') return null;
    return (
        <View className="flex-row items-center gap-x-1 shrink min-w-0">
            {icon}
            <FontText
                type="body"
                weight="regular"
                className="text-content-secondary text-xxs"
                style={{ lineHeight: LH.meta, ...START_ALIGN }}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {children}
            </FontText>
        </View>
    );
};

export interface RecordCardProps {
    /** Small badge before the title, e.g. a transaction direction arrow. */
    leading?: ReactNode;
    /** A string is styled and ellipsized; a node is rendered as-is. */
    title?: ReactNode;
    /** A string is styled; a node is rendered as-is. */
    subtitle?: ReactNode;
    /** 0..N <RecordChip>. */
    chips?: ReactNode;
    /** <DualAmount size="sm" />. */
    amount?: ReactNode;
    /** <StatusBox />. */
    status?: ReactNode;
    /** 0..N <RecordMetaItem> or self-contained pills. The strip is omitted when falsy. */
    meta?: ReactNode;
    /** Hairline rule above the meta strip. Off when the strip carries its own chips. */
    metaDivider?: boolean;
    className?: string;
}

const asText = (value: ReactNode, className: string, lineHeight: number) => {
    if (value === null || value === undefined || value === false || value === '') return null;
    // A caller-supplied node styles itself
    if (typeof value !== 'string' && typeof value !== 'number') return value;
    return (
        <FontText
            type="body"
            weight="regular"
            className={className}
            style={{ lineHeight, ...START_ALIGN }}
            numberOfLines={1}
            ellipsizeMode="tail"
        >
            {value}
        </FontText>
    );
};

/**
 * The shared list-record card: order, transaction and payment link all compose it.
 * Left column carries identity (title, subtitle, references), right column carries
 * money and state, and an optional strip below holds customer detail.
 *
 * Defining the spacing once is the point — the three cards had drifted into three
 * different structures for the same anatomy.
 */
export default function RecordCard({
    leading,
    title,
    subtitle,
    chips,
    amount,
    status,
    meta,
    metaDivider = true,
    className,
}: RecordCardProps) {
    const titleNode = asText(title, 'text-content-primary text-sm', LH.title);
    const subtitleNode = asText(subtitle, 'text-content-secondary text-xs', LH.sub);

    return (
        <View className={cn('bg-white border border-tertiary rounded p-4 mb-2', className)}>
            {/* items-start so a two-line amount never vertically centres the title */}
            <View className="flex-row items-start gap-x-2">
                <View className="flex-1 min-w-0">
                    {(leading || titleNode) && (
                        <View className="flex-row items-center gap-x-2">
                            {leading}
                            {titleNode && <View className=" min-w-0 ">{titleNode}</View>}
                        </View>
                    )}
                    {subtitleNode && <View className="mt-1 self-start">{subtitleNode}</View>}
                    {chips && (
                        <View className="flex-row items-center gap-x-1 mt-2 min-w-0">{chips}</View>
                    )}
                </View>

                {/* flex:0 0 auto — React Native defaults flexShrink to 0, but spell it out */}
                <View className="shrink-0 items-end">
                    {amount}
                    {status && <View className="mt-1">{status}</View>}
                </View>
            </View>

            {meta && (
                <View className={cn(
                    'mt-2 flex-row flex-wrap items-center gap-x-4 gap-y-2',
                    metaDivider && 'pt-2 border-t border-tertiary'
                )}>
                    {meta}
                </View>
            )}
        </View>
    );
}
