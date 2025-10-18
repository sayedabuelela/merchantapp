import { DeepPartial } from 'react-hook-form';
import { create } from 'zustand';
import { CreatePaymentLinkTypes } from './payment-links.scheme';

interface PaymentLinkStore {
    formData: DeepPartial<CreatePaymentLinkTypes>;
    setFormData: (data: DeepPartial<CreatePaymentLinkTypes>) => void;
    clearFormData: () => void;
}

export const usePaymentLinkStore = create<PaymentLinkStore>((set) => ({
    formData: {
        paymentType: '',
        name: '',
        totalAmount: '',
        items: [],
        extraFees: [],
        dueDate: undefined,
        referenceId: '',
        description: '',
    },
    setFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),
    clearFormData: () => set({
        formData: {
            paymentType: '',
            name: '',
            totalAmount: '',
            items: [],
            extraFees: [],
            dueDate: undefined,
            referenceId: '',
            description: '',
        }
    }),
}));