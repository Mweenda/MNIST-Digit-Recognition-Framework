# API & Persistence Documentation

## Overview

The MNIST API server uses tRPC for end-to-end type safety and strict input validation at the security perimeter (the "400 Gate").

## API Architecture

### Tech Stack

- **Framework**: tRPC 10.45 (Standalone Express adapter)
- **Runtime**: Node.js 20+
- **Validation**: Zod 3.22
- **Language**: TypeScript 5.3
- **Port**: 3001 (development)

### Request Flow

```
Client Request
    ↓
HTTP POST /ml/predict
    ↓
tRPC Router
    ↓
Zod Schema Validation ← Security Perimeter ("400 Gate")
    ↓
Input Validation (Base64, Size, Format)
    ↓
Inference Service
    ↓
Model Prediction
    ↓
Response (JSON)
```

## API Endpoints

### `ml.predict` - Predict Digit

**Type**: Mutation (POST)

**Request Schema** (Zod validated):

```typescript
{
  imageData: string      // Data URL format
  sessionId: string      // UUID v4
}
```

**Request Example**:

```json
{
  "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAU...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response Schema**:

```typescript
{
  predictedDigit: number        // 0-9
  confidence: number            // 0.0 - 1.0
  allProbabilities: number[]    // [10 elements]
  inferenceTimeMs: number       // milliseconds
}
```

**Response Example**:

```json
{
  "predictedDigit": 7,
  "confidence": 0.9734,
  "allProbabilities": [
    0.0001, 0.0002, 0.0003, 0.0005, 0.0008,
    0.0003, 0.0002, 0.9734, 0.0062, 0.0080
  ],
  "inferenceTimeMs": 34
}
```

## Security Perimeter ("400 Gate")

All invalid inputs are rejected with HTTP 400 (BAD_REQUEST).

### Validation Rules

#### 1. **Data URL Format**

**Schema**:
```
data:image/png;base64,[base64-string]
```

**Validation**:
- Must start with exactly: `data:image/png;base64,`
- No variations allowed (JPEG, WEBP, etc. rejected)

**Examples**:
```
✅ VALID:   data:image/png;base64,iVBORw0KGgo...
❌ INVALID: data:image/jpg;base64,iVBORw0KGgo...  (wrong format)
❌ INVALID: data:image/png;iVBORw0KGgo...         (missing base64 marker)
❌ INVALID: iVBORw0KGgo...                         (no data URL prefix)
```

#### 2. **Base64 Encoding**

**Regex Pattern**:
```regex
^data:image/png;base64,[A-Za-z0-9+/]+={0,2}$
```

**Rules**:
- Only alphanumeric, `+`, `/` characters allowed in payload
- Padding: 0-2 trailing `=` characters (not 3 or more)
- No whitespace, newlines, or special characters

**Examples**:
```
✅ VALID:   [A-Za-z0-9+/]+={0,2}
❌ INVALID: [A-Za-z0-9+/]%20+={0,2}    (contains space)
❌ INVALID: [A-Za-z0-9+/]+===          (3+ padding chars)
❌ INVALID: [A-Za-z0-9+/\n]+           (contains newline)
```

#### 3. **Payload Size**

**Limit**: 65,536 bytes (64KB) maximum

**Examples**:
```
✅ VALID:   data:image/png;base64,[30KB payload]
❌ INVALID: data:image/png;base64,[100KB payload]
```

**Rationale**: 
- 28×28 grayscale image = ~196 bytes raw
- PNG encoded ≈ 1-3KB typically
- 64KB limit accommodates high-quality variations
- Prevents memory exhaustion attacks

#### 4. **Base64 Payload Length**

**Range**: > 0 and < 60,000 characters

**Logic**:
- Must have at least some data
- Maximum payload before base64 prefix
- Additional safety margin from total size limit

#### 5. **Session ID Format**

**Format**: UUID v4

**Pattern**:
```regex
^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$
```

**Examples**:
```
✅ VALID:   550e8400-e29b-41d4-a716-446655440000
❌ INVALID: 550e8400-e29b-11d4-a716-446655440000  (wrong version)
❌ INVALID: not-a-uuid
```

### Test Cases (400 Gate)

The security perimeter is tested with 7 critical test cases:

```bash
# Run all security tests
bash scripts/test-400-gate.sh
```

**Test 1: Valid Input**
```json
{
  "imageData": "data:image/png;base64,iVBORw0KGgo...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```
✅ Expected: 200 OK

**Test 2: Whitespace Injection**
```json
{
  "imageData": "data:image/png;base64,iVBORw0KGgo... \n",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```
❌ Expected: 400 BAD_REQUEST

**Test 3: JPEG Smuggling**
```json
{
  "imageData": "data:image/jpeg;base64,iVBORw0KGgo...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```
❌ Expected: 400 BAD_REQUEST

**Test 4: Invalid Base64 Padding**
```json
{
  "imageData": "data:image/png;base64,iVBORw0KGgo===",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```
❌ Expected: 400 BAD_REQUEST

**Test 5: Invalid UUID**
```json
{
  "imageData": "data:image/png;base64,iVBORw0KGgo...",
  "sessionId": "not-a-uuid"
}
```
❌ Expected: 400 BAD_REQUEST

**Test 6: Special Characters in Base64**
```json
{
  "imageData": "data:image/png;base64,iVBORw0KGgo<>!@#$%",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```
❌ Expected: 400 BAD_REQUEST

**Test 7: Newline Injection**
```json
{
  "imageData": "data:image/png;base64,iVBORw0KGgo\n",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```
❌ Expected: 400 BAD_REQUEST

## Error Handling

### Error Response Format

```typescript
{
  code: string           // tRPC error code
  message: string        // Human-readable error message
  cause?: unknown        // Additional details
}
```

### Common Error Codes

| Code | HTTP Status | Message | Cause |
|------|-------------|---------|-------|
| `BAD_REQUEST` | 400 | "Image data exceeds 64KB limit" | Oversized payload |
| `BAD_REQUEST` | 400 | "Invalid Data URL format" | Malformed data URL |
| `BAD_REQUEST` | 400 | "Must be PNG format" | Wrong image type |
| `BAD_REQUEST` | 400 | "Invalid session identifier" | Bad UUID |
| `INTERNAL_SERVER_ERROR` | 500 | "Failed to process image data" | Inference error |

### Example Error Response

```json
{
  "code": "BAD_REQUEST",
  "message": "Image data exceeds 64KB limit",
  "cause": {
    "code": "too_big",
    "maximum": 65536,
    "inclusive": true,
    "type": "string"
  }
}
```

## Type Safety

### End-to-End TypeScript

```typescript
// Backend types auto-exported to frontend
export type PredictInput = z.infer<typeof PredictInputSchema>
export type AppRouter = typeof mlRouter

// Frontend automatically gets these types
const client = createTRPCClient<AppRouter>()

// Fully typed requests
const result = await client.predict.mutate({
  imageData: "data:image/png;base64,...",  // Type-checked
  sessionId: "..."                          // Type-checked
}) // result is fully typed
```

## CORS Configuration

### Current (Development)

```javascript
CORS enabled for:
- http://localhost:3000 (web app)
- http://localhost:3001 (API server)
```

### Production Configuration (Future)

```javascript
CORS enabled for:
- https://app.example.com
- https://www.example.com
```

## Monitoring & Logging

### Request Logging

Each prediction request logs:
- Timestamp
- Session ID
- Requested operation
- Response time
- Error status (if any)

### Inference Metrics

```
{
  timestamp: ISO 8601
  sessionId: UUID
  predictedDigit: 0-9
  confidence: 0.0-1.0
  inferenceTimeMs: number
  modelVersion: string
}
```

## Firestore Integration (Future)

### Collection: `predictions`

```typescript
interface PredictionRecord {
  timestamp: Timestamp       // Firebase timestamp
  sessionId: string          // UUID v4
  predictedDigit: number     // 0-9
  confidence: number         // 0.0-1.0
  allProbabilities: number[] // [10 elements]
  inferenceTimeMs: number    // milliseconds
  modelVersion: string       // e.g., "1.0"
  clientVersion: string      // e.g., "1.0"
  userAgent: string         // Browser/app identifier
}
```

### Queries

```javascript
// Get predictions for session
db.collection('predictions')
  .where('sessionId', '==', sessionId)
  .orderBy('timestamp', 'desc')
  .limit(10)

// Get predictions by digit
db.collection('predictions')
  .where('predictedDigit', '==', 7)
  .orderBy('confidence', 'desc')

// Get average confidence
db.collection('predictions')
  .get()
  .then(docs => {
    const avg = docs.docs
      .map(d => d.data().confidence)
      .reduce((a, b) => a + b) / docs.size
  })
```

## Performance Optimization

### Inference Optimization

```
Target: < 50ms per prediction

Actual: 30-40ms
- Model inference: ~25ms
- I/O & validation: ~5-10ms
- Buffer overhead: ~1-5ms
```

### Caching Strategy (Future)

```typescript
// Cache frequent predictions
const cache = new Map<string, PredictionResult>()

// 10-minute TTL for identical drawings
cache.set(imageHash, result)
```

### Batching (Future)

```typescript
// Process multiple predictions efficiently
const batch = await predictBatch([image1, image2, image3])
```

## Deployment

### Environment Variables

```bash
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
MODEL_PATH=./trained-models/mnist-cnn.json
```

### Health Check

```bash
GET http://localhost:3001/health

200 OK
{
  "status": "healthy",
  "timestamp": "2026-01-22T12:00:00Z"
}
```

## References

- [tRPC Documentation](https://trpc.io/)
- [Zod Validation](https://zod.dev/)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

---

**Documentation Version**: 1.0  
**Last Updated**: January 22, 2026  
**Status**: Complete
