// paymentLink.mappers.ts
import { PaymentLink } from './payment-links.model'; // adjust import path
import { CreatePaymentLinkTypes } from './payment-links.scheme';

export function mapApiToFormValues(api: PaymentLink): CreatePaymentLinkTypes {
    const customerName =
        // prefer structured customer -> name if exists, otherwise fallback to customerName
        (api.customer && (api.customer as any).name) || api.customerName || '';

    const extraFees = api.extraFees?.map((f) => ({
        name: f.name,
        flatFee: Number(f.flatFee) || 0,
        rate: Number(f.rate) || 0,
    }));

    // Map invoiceItems (api) -> items (form)
    const items = api.invoiceItems?.map((it) => ({
        description: it.description,
        unitPrice: Number(it.unitPrice),
        quantity: Number(it.quantity),
        subTotal: Number(it.subTotal ?? it.unitPrice * it.quantity),
    }));

    const base = {
        paymentType: api.paymentType as 'simple' | 'professional',
        customer: { name: customerName },
        currency: api.currency ?? '',
        extraFees: extraFees && extraFees.length ? extraFees : undefined,
        dueDate: api.dueDate ? new Date(api.dueDate) : undefined,
        referenceId: api.referenceId ?? api.paymentRequestId ?? undefined,
        description: api.description ?? undefined,
    };

    if (api.paymentType === 'simple') {
        return {
            ...base,
            // convert number -> string for the text input
            totalAmount:
                api.totalAmountWithoutFees !== undefined && api.totalAmountWithoutFees !== null
                    ? String(api.totalAmountWithoutFees)
                    : '',
        } as CreatePaymentLinkTypes;
    } else {
        return {
            ...base,
            items: items && items.length ? items : [],
        } as CreatePaymentLinkTypes;
    }
}
