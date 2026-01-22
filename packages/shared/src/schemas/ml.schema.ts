import { z } from 'zod'

const DATA_URL_PREFIX = 'data:image/png;base64,' as const

const STRICT_BASE64_DATA_URL_REGEX = /^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/

export const PredictInputSchema = z
  .object({
    imageData: z
      .string()
      .max(65536, 'Image data exceeds 64KB limit')
      .regex(
        STRICT_BASE64_DATA_URL_REGEX,
        'Invalid Data URL format. Must be data:image/png;base64,[valid-base64]'
      )
      .refine((data) => data.trim().length > 0, 'Image data is required')
      .refine((data) => data.startsWith(DATA_URL_PREFIX), 'Data URL must use PNG format with base64 encoding')
      .refine((data) => {
        const payload = data.slice(DATA_URL_PREFIX.length)
        return payload.length > 0 && payload.length < 60000
      }, 'Base64 payload length out of acceptable range'),
    sessionId: z.string().uuid('Invalid session identifier'),
  })
  .strict()

export type PredictInput = z.infer<typeof PredictInputSchema>
