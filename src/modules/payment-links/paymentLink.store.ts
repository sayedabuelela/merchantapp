import { DeepPartial } from 'react-hook-form';
import { create } from 'zustand';
import { CreatePaymentLinkTypes } from './payment-links.scheme';

interface PaymentLinkStore {
    formData: DeepPartial<CreatePaymentLinkTypes>;
    qrCode: boolean;
    setFormData: (data: DeepPartial<CreatePaymentLinkTypes>) => void;
    setQrCode: (qrCode: boolean) => void;
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
    qrCode: false,
    setFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),
    setQrCode: (qrCode) => set({ qrCode }),
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
        },
        qrCode: false,
    }),
}));