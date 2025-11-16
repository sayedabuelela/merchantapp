---
trigger: always_on
---

# API & React Query

- Use React Query (useQuery/useMutation) for all API fetching.
- Queries must have typed keys.
- All API responses must be typed with TypeScript interfaces.
- Use Zod to validate API responses before using them.
- Keep API logic in a dedicated folder.