---
trigger: always_on
---

# Payments Module Rules (Refund & Void)

The AI must follow these rules when working on the payments module located at:
@src/modules/payments

## 1. Web Logic Parity
- Always compare the mobile logic with the web version implementation from `bank-cutoff-checker.ts` and the `performTransactionOperation` function.
- The refund and void eligibility conditions must match the web version exactly.
- Any UI visibility condition for Refund or Void MUST follow the same predicate rules used in the web app.

## 2. Refund Visibility Rules
Refund is allowed only when:

- transaction.status is "approved" or "success"
- transaction.method !== "cash"
- transaction.paymentChannel is NOT POS, unless `isPosRefundAvailable` is true
- transaction.totalRefundedAmount < transaction.totalCapturedAmount
- transaction.trxType !== "authorize"
- transaction.trxType !== "refund"
- transaction.installmentDetails is falsy
- Apply the same Angular condition:
  (approved/success) &&
  (!POS OR isPosRefundAvailable) &&
  (method !== 'cash') &&
  (no installmentDetails) &&
  (totalRefunded < totalCaptured) &&
  (trxType !== 'authorize') &&
  (trxType !== 'refund')

## 3. POS Refund Rules
- If the payment method is card AND paymentChannel is pos AND apiOperation is REFUND:
  - Construct the payload exactly like the web version.
  - Use cardDataToken.
  - Set interactionSource="POS" and isPOSPortalRefund=true.

## 4. Void Visibility Rules
Void is allowed only when:
- The transaction meets ALL web conditions.
- Follow the cutoff and eligibility logic inside `bank-cutoff-checker.ts`.

If the backend returns:
"Void request can not be processed"
→ Display the same UI message as the web:
"This transaction is not eligible for void. Please use the refund option instead."

## 5. Consistency Across All Screens
- Apply the SAME eligibility logic to:
  - Transaction Details screen
  - Order Details screen
  - Action Modal (Refund/Void modal)
- There must be zero differences in visibility rules across all three areas.

## 6. Action Modal Behavior
- The modal must:
  - Never freeze the UI after the API call.
  - Close immediately after success.
  - Show proper error messages on failure.
  - Refresh the parent screen state ONLY after modal closes.

Freeze prevention rules:
- Never leave a pending promise without resolving.
- Ensure that both success and error paths call `setLoading(false)` or equivalent.
- Make sure React Query / state updates are not causing infinite re-renders.

## 7. API Operation Rules
When calling performTransactionOperation:
- Fully replicate the same payload logic as the web version.
- For POS refunds:
  amount = amount * 100
- For CONTACT refunds:
  paymentMethod.type = 'CONTACT'
  contact.otp = otp
- For CAPTURE:
  include autoVoid

## 8. Error Handling
- Always surface backend messages exactly as returned.
- Never swallow backend errors.
- Map web error messages to mobile toast/UI components.

## 9. Safety Rules
- Never modify business logic unless required to fix parity issues.
- Do not introduce regressions in existing flows.
- Keep changes minimal and incremental.
- Always type inputs, responses, and API models.

## 10. Validation
- Validate visibility conditions with the existing transaction model.
- Validate refund/void availability using the same rules as the web app.
- Ensure that the AI reviews both the frontend and backend logic before making changes.

