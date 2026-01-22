# Shared Package

Centralized type definitions, Zod validation schemas, and shared utilities used across the MNIST monorepo.

## Purpose

This package ensures consistency and type safety across all applications and services by:
- Defining single source of truth for data schemas
- Exporting TypeScript types for end-to-end type safety
- Providing validation rules for all input data
- Preventing duplicate schema definitions

## Contents

### Schemas

#### `ml.schema.ts`

Zod schemas for MNIST API predictions:

```typescript
// Input validation
export const PredictInputSchema = z.object({
  imageData: z.string()
    .max(65536, 'Image data exceeds 64KB limit')
    .regex(STRICT_BASE64_DATA_URL_REGEX)
    .refine(...)
    .refine(...),
  sessionId: z.string().uuid('Invalid session identifier'),
})

// Type inference
export type PredictInput = z.infer<typeof PredictInputSchema>
```

**Validation Rules**:
- PNG format only (JPEG/WEBP rejected)
- Valid base64 encoding
- UUID v4 session ID
- Maximum 64KB payload
- No whitespace/special characters

**Usage**:
```typescript
import { PredictInputSchema, type PredictInput } from '@repo/shared'

// Backend (tRPC)
const result = PredictInputSchema.parse(input)

// Frontend (tRPC client gets types)
import type { PredictInput } from '@repo/shared'
const payload: PredictInput = { ... }
```

### Types (Future)

```
types/
├── api.types.ts          # API request/response types
├── model.types.ts        # ML model types
└── common.types.ts       # Shared utility types
```

## Installation

Already included in monorepo workspace. No separate installation needed.

## Usage

### From API Package

```typescript
import { PredictInputSchema } from '@repo/shared'
import type { PredictInput } from '@repo/shared'

const t = initTRPC.create()

export const mlRouter = t.router({
  predict: t.procedure
    .input(PredictInputSchema)
    .mutation(async ({ input }) => {
      // input is fully typed as PredictInput
      const result = await inferDigit(input.imageData)
      return result
    })
})
```

### From Web Package

```typescript
import type { AppRouter } from '@repo/api'
import { createTRPCClient } from '@trpc/client'

// Client automatically gets all types
const client = createTRPCClient<AppRouter>()

const response = await client.predict.mutate({
  imageData: dataUrl,
  sessionId: sessionId  // Type-checked UUID
})
```

### From ML Core Package

```typescript
import { PredictInputSchema } from '@repo/shared'

// Validate input before processing
const validated = PredictInputSchema.parse({
  imageData: '...',
  sessionId: '...'
})
```

## Testing

```bash
cd packages/shared

# Run schema validation tests
pnpm test

# Type check
pnpm type-check

# View schema details
pnpm test:verbose
```

### Test Coverage

See `tests/ml-schema.test.ts`:
- ✅ Valid input acceptance (5 tests)
- ✅ Base64 format validation (12 tests)
- ✅ Media type validation (8 tests)
- ✅ Size validation (6 tests)
- ✅ UUID validation (10 tests)
- ✅ Edge cases & security (6 tests)
- **Total**: 47 tests, 100% passing

## Architecture

### Type Flow

```
┌─────────────────────────────────────────────────────────┐
│ @repo/shared (Single Source of Truth)                   │
│                                                         │
│  PredictInputSchema (Zod)                              │
│  ↓                                                      │
│  Inferred Type: PredictInput                           │
└──────────────┬──────────────────┬──────────────────────┘
               │                  │
       ┌───────▼────────┐  ┌──────▼──────────────┐
       │ @repo/api      │  │ @repo/web          │
       │ (Backend)      │  │ (Frontend)         │
       │                │  │                    │
       │ - Validates    │  │ - Requests typed   │
       │ - Routes       │  │ - Responses typed  │
       │ - Infers       │  │ - IDE autocomplete │
       └────────────────┘  └────────────────────┘
```

### Schema Composition

Future: Complex schema composition

```typescript
// Base schemas
const ImageDataSchema = z.string()
  .max(65536)
  .regex(STRICT_BASE64_DATA_URL_REGEX)

const SessionSchema = z.string().uuid()

// Composed schemas
const PredictInputSchema = z.object({
  imageData: ImageDataSchema,
  sessionId: SessionSchema
})

// Can be reused
const BulkPredictSchema = z.object({
  predictions: z.array(PredictInputSchema)
})
```

## Development

### Adding New Schemas

1. **Create schema file** in `src/schemas/`
2. **Export schema and type**:
   ```typescript
   export const MySchema = z.object({...})
   export type MyType = z.infer<typeof MySchema>
   ```
3. **Export from `index.ts`**:
   ```typescript
   export { MySchema, type MyType } from './schemas/my.schema'
   ```
4. **Add tests** in `tests/`
5. **Run validation**: `pnpm test`

### Validation Best Practices

```typescript
// ✅ DO: Specific error messages
z.string().email('Must be valid email address')

// ❌ DON'T: Generic errors
z.string()

// ✅ DO: Chain validations from specific to general
z.string()
  .min(8, 'Too short')
  .max(255, 'Too long')
  .email('Invalid email')

// ✅ DO: Use .refine() for complex logic
.refine(
  (data) => data.startsWith('data:image/png'),
  'Must be PNG format'
)
```

## Common Errors

### Type Mismatch in tRPC Procedure

**Error**: Type mismatch between schema and procedure

**Solution**: Always use Zod's `z.infer<typeof Schema>` for types

```typescript
// ❌ WRONG
type Input = { imageData: string; sessionId: string }

// ✅ RIGHT
type Input = z.infer<typeof PredictInputSchema>
```

### Import Mismatch

**Error**: Module resolution fails

**Solution**: Always import from `@repo/shared`

```typescript
// ❌ WRONG
import { PredictInputSchema } from '../../../packages/shared/src/schemas'

// ✅ RIGHT
import { PredictInputSchema } from '@repo/shared'
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial release with PredictInputSchema |

## Future Enhancements

- [ ] Response schema validation
- [ ] Error schema standardization
- [ ] Pagination schema helpers
- [ ] API versioning schema
- [ ] OpenAPI schema generation

## References

- [Zod Documentation](https://zod.dev/)
- [tRPC Type Safety](https://trpc.io/docs/server/procedures)

---

**Package**: @repo/shared  
**Status**: Production Ready  
**Last Updated**: January 22, 2026
