import { AccountType } from '@/src/modules/onboarding/account-type/account-type.model';
import { create } from 'zustand';
import { ApprovalStatus, PublicData } from './data/onboarding-data.model';
import { BusinessContactFormData } from './contact/contact.model';
import { Currency } from './currency/currency.model';
import { Document, BusinessLogoMetadata } from './documents/documents.model';

// Pending edits interface for storing local changes before final submission
// Used when merchant is approved+live or rejected (full submit only mode)
export interface PendingOnboardingEdits {
    publicData?: Partial<PublicData> | null;
    businessContactInfo?: BusinessContactFormData | null;
    currencies?: Currency[] | null;
    documents?: Document[] | null;
    businessLogo?: BusinessLogoMetadata | null;
}

const initialPendingEdits: PendingOnboardingEdits = {
    publicData: null,
    businessContactInfo: null,
    currencies: null,
    documents: null,
    businessLogo: null,
};

interface OnboardingState {
    accountType: AccountType | null;
    setAccountType: (type: AccountType | null) => void;

    // Approval status for determining which API endpoint to use
    approvalStatus: ApprovalStatus | null;
    setApprovalStatus: (status: ApprovalStatus | null) => void;

    // Pending edits for approved/rejected merchants (full submit only mode)
    pendingEdits: PendingOnboardingEdits;
    setPendingPublicData: (data: Partial<PublicData>) => void;
    setPendingContactInfo: (data: BusinessContactFormData) => void;
    setPendingCurrencies: (currencies: Currency[]) => void;
    setPendingDocuments: (documents: Document[]) => void;
    setPendingBusinessLogo: (logo: BusinessLogoMetadata | null) => void;
    hasPendingEdits: () => boolean;
    clearPendingEdits: () => void;
    clearPendingSection: (section: keyof PendingOnboardingEdits) => void;
}

export const useOnboardingStore = create<OnboardingState>()((set, get) => ({
    accountType: null,
    setAccountType: (type: AccountType | null) => set({ accountType: type }),

    // Approval status for endpoint selection
    approvalStatus: null,
    setApprovalStatus: (status: ApprovalStatus | null) => set({ approvalStatus: status }),

    // Pending edits state and actions
    pendingEdits: initialPendingEdits,

    setPendingPublicData: (data: Partial<PublicData>) =>
        set((state) => ({
            pendingEdits: {
                ...state.pendingEdits,
                publicData: data,
            },
        })),

    setPendingContactInfo: (data: BusinessContactFormData) =>
        set((state) => ({
            pendingEdits: {
                ...state.pendingEdits,
                businessContactInfo: data,
            },
        })),

    setPendingCurrencies: (currencies: Currency[]) =>
        set((state) => ({
            pendingEdits: {
                ...state.pendingEdits,
                currencies,
            },
        })),

    setPendingDocuments: (documents: Document[]) =>
        set((state) => ({
            pendingEdits: {
                ...state.pendingEdits,
                documents,
            },
        })),

    setPendingBusinessLogo: (logo: BusinessLogoMetadata | null) =>
        set((state) => ({
            pendingEdits: {
                ...state.pendingEdits,
                businessLogo: logo,
            },
        })),

    hasPendingEdits: () => {
        const { pendingEdits } = get();
        return !!(
            pendingEdits.publicData ||
            pendingEdits.businessContactInfo ||
            pendingEdits.currencies ||
            pendingEdits.documents ||
            pendingEdits.businessLogo
        );
    },

    clearPendingEdits: () =>
        set({ pendingEdits: initialPendingEdits }),

    clearPendingSection: (section: keyof PendingOnboardingEdits) =>
        set((state) => ({
            pendingEdits: {
                ...state.pendingEdits,
                [section]: null,
            },
        })),
}));

export const accountTypeSelector = (state: OnboardingState) => state.accountType;
export const setAccountTypeSelector = (state: OnboardingState) => state.setAccountType;

// Selectors for approval status
export const approvalStatusSelector = (state: OnboardingState) => state.approvalStatus;
export const setApprovalStatusSelector = (state: OnboardingState) => state.setApprovalStatus;

// Selectors for pending edits
export const pendingEditsSelector = (state: OnboardingState) => state.pendingEdits;
export const hasPendingEditsSelector = (state: OnboardingState) => state.hasPendingEdits;