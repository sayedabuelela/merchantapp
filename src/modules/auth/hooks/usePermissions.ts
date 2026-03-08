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
    if (!actions) return {} as IActions;
    // Deep clone to avoid mutating the original store data
    const result: IActions = JSON.parse(JSON.stringify(actions));

    for (const key in result) {
        const mainItem = (result as any)[key];
        if (key !== "*") {
            for (const k in mainItem) {
                const children = mainItem[k];
                for (const inner in children) {
                    if (!children[inner]) delete children[inner];
                }
                if (!Object.keys(children).length) {
                    delete mainItem[k];
                }
            }
            if (!Object.keys(mainItem).length) {
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
    if (mod === 'balance') console.log('checkRules balance: full actions:', JSON.stringify(userActions));

    if ("*" in userActions) {
        return true;
    }

    if (!moduleActions) return false;

    if (inners.length >= 2 && moduleActions[inners[0]]) {
        const groupKey = inners[0];
        const groupActions = new Set(Object.keys(moduleActions[groupKey] || {}));
        for (let i = 1; i < inners.length; i++) {
            if (groupActions.has(inners[i])) {
                return true;
            }
        }
    }

    const generalActions = new Set(Object.keys(moduleActions[""] || {}));
    const ownActions = new Set(Object.keys(moduleActions[`${mod}_own`] || {}));
    const anyActions = new Set(Object.keys(moduleActions[`${mod}_any`] || {}));

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
            canViewPaymentLinks: canViewModule(roles, EMainActions.PAYMENT_REQUESTS),
            canCreatePaymentLinks: checkRules('', roles, EMainActions.PAYMENT_REQUESTS, ["create_pr"]),
            canViewPaymentLinkDetails: checkRules(merchantId, roles, EMainActions.PAYMENT_REQUESTS, ["view_share_pr"], creatorId),
            canEditPaymentLink: checkRules(merchantId, roles, EMainActions.PAYMENT_REQUESTS, ["edit_pr"], creatorId),
            canDeletePaymentLink: checkRules(merchantId, roles, EMainActions.PAYMENT_REQUESTS, ["delete_pr"], creatorId),
            canCancelPaymentLink: checkRules(merchantId, roles, EMainActions.PAYMENT_REQUESTS, ["cancel_pr"], creatorId),

            // Transactions Permissions
            canViewTransactions: checkRules('', roles, EMainActions.TRANSACTION, ["view_tr"]),
            canRefundTransactions: checkRules('', roles, EMainActions.TRANSACTION, ["refund_tr"]),

            //Business Profile
            canViewBusinessProfile: checkRules('', roles, EMainActions.SETTINGS, ["businessProfile", "view_bp_st"], ''),
            canEditBusinessProfile: checkRules('', roles, EMainActions.SETTINGS, ["businessProfile", "edit_bp_st"], ''),
            canRequestBusinessProfile: checkRules('', roles, EMainActions.SETTINGS, ["businessProfile", "request_bp_st"], ''),
            canViewBalance: checkRules('', roles, EMainActions.BALANCE, ["", "view_balance"]),
            canCreateBalance: checkRules('', roles, EMainActions.BALANCE, ["", "create_balance"]),
            canEditBalance: checkRules('', roles, EMainActions.BALANCE, ["", "edit_balance"]),

            // Onboarding Permissions

        };
    }, [roles]);
};

export default usePermissions;