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
        // Virtual-origin links return currency:"EGP" — seed the form with the original
        // virtual id so the dropdown shows what the merchant created the link in
        currency: api.virtualCurrency ?? api.currency ?? '',
        extraFees: extraFees && extraFees.length ? extraFees : undefined,
        dueDate: api.dueDate ? new Date(api.dueDate) : undefined,
        referenceId: api.referenceId,
        description: api.description ?? undefined,
    };

    if (api.paymentType === 'simple') {
        // Virtual-origin links: amount is edited in the original virtual units
        const amountValue = api.virtualCurrency != null && api.virtualAmount != null
            ? api.virtualAmount
            : api.totalAmountWithoutFees;
        return {
            ...base,
            // convert number -> string for the text input
            totalAmount:
                amountValue !== undefined && amountValue !== null
                    ? String(amountValue)
                    : '',
        } as CreatePaymentLinkTypes;
    } else {
        return {
            ...base,
            items: items && items.length ? items : [],
        } as CreatePaymentLinkTypes;
    }
}
