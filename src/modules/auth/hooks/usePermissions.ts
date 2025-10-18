import { useMemo } from "react";
import { IActions } from "../auth.model";


export enum EMainActions {
    SETTINGS = 'settings',
    PRODUCTS = 'product',
    TRANSACTION = 'transaction',
    TRANSFERS = 'transfer',
    PAYMENT_PAGES = 'payment_pages',
    BALANCE = 'balance',
    DASHBOARD = 'dashboard',
    PAYMENT_REQUESTS = 'payment_requests',
    PLANS = 'plans',
    home = 'home',
    SUBSCRIPTIONS = 'subscriptions',
    INTEGRATION = 'integration',
    CUSTOMER = 'customer',
    ANY = '*',
}

export function serializeActions(actions: IActions): IActions {
    let result: IActions = { ...actions };

    for (const key in actions) {
        const mainItem = (actions as any)[key];
        if (key !== "*") {
            for (const k in mainItem) {
                const children = mainItem[k];
                for (const inner in children) {
                    if (!children[inner]) delete (result as any)[key][k][inner];
                }
                if (!Object.keys((result as any)[key][k]).length) {
                    delete (result as any)[key][k];
                }
            }
            if (!Object.keys((result as any)[key]).length) {
                delete (result as any)[key];
            }
        }
    }
    if (
        result &&
        result["settings"] &&
        (result as any)["settings"]["businessProfile"]
    ) {
        (result as any)["settings"][""] = (result as any)["settings"]["businessProfile"];
    }
    return result;
}

export const isOwner = (currentMerchantId: string, creatorId: string): boolean => {
    return currentMerchantId === creatorId;
};
export const checkRules = (
    currentMerchantId = '',
    actions: IActions,
    mod: string,
    inners: string[],
    creatorId = ""
): boolean => {
    const userActions = serializeActions(actions);
    const moduleActions = userActions[mod];

    if ("*" in userActions) {
        return true;
    }

    if (!moduleActions) return false;

    const generalActions = new Set(Object.keys(moduleActions[""] || {}));
    const ownActions = new Set(Object.keys(moduleActions["payment_requests_own"] || {}));
    const anyActions = new Set(Object.keys(moduleActions["payment_requests_any"] || {}));

    for (const inner of inners) {
        if (generalActions.has(inner)) {
            return true;
        }
        if (creatorId) {
            if (
                (ownActions.has(inner) && isOwner(currentMerchantId, creatorId)) ||
                anyActions.has(inner)
            ) {
                return true;
            }
        }
    }

    return false;
};

export const canViewModule = (
    actions: IActions,
    module: string
): boolean => {
    const userActions = serializeActions(actions);
    return "*" in userActions || module in userActions;
};


const usePermissions = (roles: IActions, merchantId = '', creatorId = '') => {
    return useMemo(() => {
        return {

            // Payment Requests Permissions
            canViewPaymentRequests: canViewModule(roles, EMainActions.PAYMENT_REQUESTS),
            canCreatePaymentRequests: checkRules('', roles, EMainActions.PAYMENT_REQUESTS, ["create_pr"]),
            canViewPaymentRequestDetails: checkRules(merchantId, roles, EMainActions.PAYMENT_REQUESTS, ["view_share_pr"], creatorId),
            canEditPaymentRequests: checkRules(merchantId, roles, EMainActions.PAYMENT_REQUESTS, ["edit_pr"], creatorId),
            canDeletePaymentRequests: checkRules(merchantId, roles, EMainActions.PAYMENT_REQUESTS, ["delete_pr"], creatorId),
            canCancelPaymentRequests: checkRules(merchantId, roles, EMainActions.PAYMENT_REQUESTS, ["cancel_pr"], creatorId),

            // Transactions Permissions
            canViewTransactions: checkRules('', roles, EMainActions.TRANSACTION, ["view_tr"]),
            canRefundTransactions: checkRules('', roles, EMainActions.TRANSACTION, ["refund_tr"]),

            //Business Profile
            canViewBusinessProfile: checkRules('', roles, EMainActions.SETTINGS, ["businessProfile", "view_bp_st"], ''),
            canEditBusinessProfile: checkRules('', roles, EMainActions.SETTINGS, ["businessProfile", "edit_bp_st"], ''),
            canRequestBusinessProfile: checkRules('', roles, EMainActions.SETTINGS, ["businessProfile", "request_bp_st"], ''),

            // Onboarding Permissions

        };
    }, [roles]);
};

export default usePermissions;