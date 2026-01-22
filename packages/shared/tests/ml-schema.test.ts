import { describe, expect, test } from 'vitest'

import { PredictInputSchema } from '../src/schemas/ml.schema'

describe('PredictInputSchema - Security Perimeter', () => {
  const VALID_TINY_PNG =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

  test('accepts minimal valid PNG Data URL', () => {
    const result = PredictInputSchema.safeParse({
      imageData: VALID_TINY_PNG,
      sessionId: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(true)
  })

  test('rejects empty image data', () => {
    const result = PredictInputSchema.safeParse({
      imageData: '   ',
      sessionId: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(false)
  })

  test('rejects payload exceeding 64KB', () => {
    const oversized = 'data:image/png;base64,' + 'A'.repeat(70000)
    const result = PredictInputSchema.safeParse({
      imageData: oversized,
      sessionId: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('exceeds 64KB limit')
    }
  })

  test('rejects jpeg media type smuggling', () => {
    const result = PredictInputSchema.safeParse({
      imageData: 'data:image/jpeg;base64,ABC==',
      sessionId: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(false)
  })

  test('rejects raw base64 without data url prefix', () => {
    const result = PredictInputSchema.safeParse({
      imageData: 'ABC123==',
      sessionId: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(false)
  })

  test('rejects whitespace in base64 payload', () => {
    const result = PredictInputSchema.safeParse({
      imageData: 'data:image/png;base64,ABC DEF==',
      sessionId: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(false)
  })

  test('rejects newline injection attempt', () => {
    const result = PredictInputSchema.safeParse({
      imageData: 'data:image/png;base64,ABC\nDEF==',
      sessionId: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(false)
  })

  test('rejects invalid padding (3 equals)', () => {
    const result = PredictInputSchema.safeParse({
      imageData: 'data:image/png;base64,ABC===',
      sessionId: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(false)
  })

  test('rejects trailing script injection', () => {
    const result = PredictInputSchema.safeParse({
      imageData: 'data:image/png;base64,ABC==<script>alert(1)</script>',
      sessionId: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(false)
  })

  test('rejects extra keys (strict object)', () => {
    const result = PredictInputSchema.safeParse({
      imageData: VALID_TINY_PNG,
      sessionId: '123e4567-e89b-12d3-a456-426614174000',
      extra: 'nope',
    })
    expect(result.success).toBe(false)
  })
})
