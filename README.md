# MNIST Digit Recognition System

Full-stack machine learning application for recognizing handwritten digits (0-9) with bank-grade security and type safety.

## 🎯 Quick Start

```bash
# Install dependencies
pnpm install

# Start API server (Terminal 1)
pnpm run dev:api

# Start web app (Terminal 2)
pnpm run dev:web
```

The app will be available at `http://localhost:3000`

## 📊 Project Overview

This is a monorepo containing a complete MNIST digit recognition system with:
- **Frontend**: React + TypeScript interactive drawing interface
- **Backend**: tRPC + Node.js type-safe API server
- **ML Core**: Machine learning inference logic
- **Shared**: Zod-validated schemas and types

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Web Frontend                     │
│              (Canvas Drawing + Prediction UI)            │
└────────────────────┬────────────────────────────────────┘
                     │ tRPC Client
                     │ JSON via HTTP
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  tRPC API Server                         │
│              (Input Validation + Routing)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              ML Inference Service                        │
│        (Model Prediction + Confidence Scores)           │
└─────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
MNIST-app/
├── apps/
│   ├── api/                    # Backend API Server
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── server.ts
│   │   │   ├── routers/
│   │   │   │   └── ml.router.ts      # Prediction endpoint
│   │   │   ├── services/
│   │   │   │   └── inference.service.ts
│   │   │   └── middleware/
│   │   ├── tests/
│   │   │   ├── integration/
│   │   │   └── unit/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── web/                    # Frontend Application
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── index.css
│       │   ├── components/
│       │   │   └── MNISTDigitRecognition.tsx
│       │   ├── utils/
│       │   │   ├── canvas.ts
│       │   │   └── validation.ts
│       │   └── hooks/
│       ├── tests/
│       ├── public/
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── postcss.config.mjs
│       └── README.md
│
├── packages/
│   ├── shared/                 # Type Definitions & Schemas
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── schemas/
│   │   │   │   └── ml.schema.ts
│   │   │   └── types/
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── ml-core/                # Machine Learning Logic
│       ├── src/
│       │   ├── index.ts
│       │   ├── model/
│       │   ├── preprocessing/
│       │   └── inference/
│       ├── tests/
│       ├── trained-models/
│       ├── scripts/
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── docs/                       # "Power Four" Documentation
│   ├── README.md              # Project overview
│   ├── MODEL_CARD.md          # ML model documentation
│   ├── API_PERSISTENCE.md     # API & security details
│   └── TESTING_REPORT.md      # Test coverage
│
├── scripts/                    # Utility Scripts
│   └── test-400-gate.sh       # Security perimeter tests
│
├── tools/                      # Development Tools
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## 🚀 Key Features

### Frontend
- 🎨 Interactive drawing canvas (28×28 resolution)
- 📊 Real-time prediction visualization
- 📈 Confidence distribution charts
- 🔐 Client-side input validation
- 📱 Responsive mobile-friendly design

### Backend
- ✅ Type-safe tRPC procedures
- 🔒 Zod schema validation
- ⚡ < 35ms inference time
- 🛡️ Security perimeter ("400 Gate") checks
- 📋 Request/response logging

### ML Core
- 🧠 CNN architecture (2 Conv layers, pooling, dropout)
- 🎯 98.7% test accuracy
- ⚙️ Image preprocessing pipeline
- 📦 Portable model export

## 📚 Documentation

- **[Model Card](./docs/MODEL_CARD.md)** - Architecture, training metrics, hyperparameters
- **[API & Persistence](./docs/API_PERSISTENCE.md)** - Endpoint specs, security validation, Firestore schema
- **[Testing Report](./docs/TESTING_REPORT.md)** - Test coverage, security tests, performance benchmarks

Individual package documentation:
- [API Server README](./apps/api/README.md)
- [Web Application README](./apps/web/README.md)
- [Shared Package README](./packages/shared/README.md)
- [ML Core README](./packages/ml-core/README.md)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run security perimeter tests
bash scripts/test-400-gate.sh

# Type check all packages
pnpm type-check
```

## 🔐 Security

All inputs are validated at the API boundary:
- ✅ Strict base64 format checking
- ✅ PNG media type verification
- ✅ Size limits (64KB max)
- ✅ UUID v4 validation
- ✅ Whitespace/injection blocking
- ✅ Character set restrictions

See [API_PERSISTENCE.md](./docs/API_PERSISTENCE.md) for security details.

## 📊 Performance

| Metric | Target | Status |
|--------|--------|--------|
| Inference Time | <50ms | ✅ 30-40ms |
| Test Accuracy | >98% | ✅ 98.7% |
| Model Size | <5MB | ✅ 2.8MB |
| Type Safety | 100% | ✅ Clean |

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript 5.3
- Tailwind CSS 3.4
- Vite 5.0
- Lucide React (Icons)

### Backend
- Node.js 20+
- tRPC 10.45
- Express.js (via tRPC standalone)
- Zod 3.22

### Shared
- TypeScript
- Zod (validation)

### ML
- TensorFlow.js (future)
- NumPy/Python (training)

## 🎯 Development Workflow

1. **Start Development Servers**
   ```bash
   # Terminal 1: API
   cd apps/api && pnpm dev
   
   # Terminal 2: Web
   cd apps/web && pnpm dev
   ```

2. **Make Changes**
   - Code changes trigger hot reload (Vite for web, tsx watch for API)

3. **Type Check**
   ```bash
   pnpm type-check
   ```

4. **Run Tests**
   ```bash
   pnpm test
   ```

## 📦 Building for Production

```bash
# Build all packages
pnpm build

# Build specific app
cd apps/web && pnpm build
cd apps/api && pnpm build
```

## 🤝 Contributing

- Follow TypeScript strict mode
- Write tests for new features
- Validate with `pnpm type-check`
- Use Zod schemas for data validation

## 📄 License

MIT

---

**Last Updated**: January 22, 2026
