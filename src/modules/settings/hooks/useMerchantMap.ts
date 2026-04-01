import { useMemo } from 'react';
import { BelongsTo } from '@/src/modules/auth/auth.model';

export const useMerchantMap = (belongsTo: BelongsTo[]) => {
    return useMemo(() => {
        return new Map(
            belongsTo.map(item => [
                item.merchantId,
                {
                    storeName: item.storeName,
                    businessLogoUrl: item.businessLogoUrl,
                },
            ])
        );
    }, [belongsTo]);
};
