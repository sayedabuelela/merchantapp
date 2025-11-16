---
trigger: always_on
---

- All components, hooks, functions, and helpers must be fully typed.
- Always define interfaces/types for props, screens, and API responses.
- Avoid using `any`; use `unknown` only when absolutely required.
- Use Zod for data validation and derive TypeScript types using `z.infer`.
- Use discriminated unions or enums for strict API response handling.