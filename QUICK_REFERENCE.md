# MNIST App - Quick Reference Guide

## 🚀 Getting Started

```bash
# Navigate to project
cd /home/t043r/Personal/Ml-Internship/MNIST-app

# Install all dependencies
pnpm install

# Start development servers
pnpm run dev:api    # Terminal 1 - Backend (port 3001)
pnpm run dev:web    # Terminal 2 - Frontend (port 3000)
```

## 📚 Documentation Map

### Start Here
- **[README.md](./README.md)** - Project overview & quick start
- **[docs/README.md](./docs/README.md)** - Documentation guide

### Core Documentation (Choose Your Role)

| Role | Read | Then |
|------|------|------|
| **Frontend Dev** | [apps/web/README.md](./apps/web/README.md) | [web/components/](./apps/web/src/components/) |
| **Backend Dev** | [apps/api/README.md](./apps/api/README.md) | [docs/API_PERSISTENCE.md](./docs/API_PERSISTENCE.md) |
| **ML Engineer** | [docs/MODEL_CARD.md](./docs/MODEL_CARD.md) | [packages/ml-core/README.md](./packages/ml-core/README.md) |
| **QA/Security** | [docs/TESTING_REPORT.md](./docs/TESTING_REPORT.md) | [docs/API_PERSISTENCE.md](./docs/API_PERSISTENCE.md) |
| **DevOps** | [docs/API_PERSISTENCE.md](./docs/API_PERSISTENCE.md) | Deployment section |
| **Manager** | [README.md](./README.md) | [docs/TESTING_REPORT.md](./docs/TESTING_REPORT.md) |

## 🏗️ Project Structure

```
.
├── apps/
│   ├── api/          Backend tRPC server
│   └── web/          React frontend
├── packages/
│   ├── shared/       Schemas & types
│   └── ml-core/      ML logic
├── docs/             "Power Four" docs
└── scripts/          Utilities
```

## 🧩 Key Files

### Frontend
- `apps/web/src/components/MNISTDigitRecognition.tsx` - Main UI
- `apps/web/src/utils/canvas.ts` - Drawing utilities
- `apps/web/src/utils/validation.ts` - Input validation

### Backend
- `apps/api/src/server.ts` - Server entry point
- `apps/api/src/routers/ml.router.ts` - API endpoints
- `apps/api/src/services/inference.service.ts` - Model inference

### Configuration
- `tailwind.config.ts` - Styling
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript config

## 🔧 Common Commands

```bash
# Development
pnpm dev                 # Start all dev servers
pnpm run dev:api         # Start API only
pnpm run dev:web         # Start web only

# Building
pnpm build               # Build all packages
pnpm type-check          # Type check all packages

# Testing
pnpm test                # Run all tests
bash scripts/test-400-gate.sh  # Security tests

# Formatting & Linting
pnpm lint                # Lint all packages
pnpm format              # Format code
```

## 🔐 Security Perimeter ("400 Gate")

**5 Validation Layers:**
1. ✅ Data URL format: `data:image/png;base64,...`
2. ✅ PNG media type enforcement
3. ✅ Base64 encoding validation
4. ✅ Payload size: max 64KB
5. ✅ UUID v4 session validation

**7 Security Tests (all passing):**
1. ✅ Valid input acceptance
2. ✅ Whitespace injection blocking
3. ✅ JPEG smuggling prevention
4. ✅ Invalid padding rejection
5. ✅ Invalid UUID rejection
6. ✅ Special character blocking
7. ✅ Newline injection blocking

## 📊 Project Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Type Safety | 100% | ✅ |
| Schema Tests | 47/47 | ✅ |
| Security Tests | 7/7 | ✅ |
| Model Accuracy | 98.7% | ✅ |
| Inference Time | 34ms | ✅ |
| Model Size | 2.8MB | ✅ |

## 🎯 API Endpoint

```bash
POST http://localhost:3001/ml/predict

# Request
{
  "imageData": "data:image/png;base64,iVBORw0KGgo...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}

# Response
{
  "predictedDigit": 7,
  "confidence": 0.9734,
  "allProbabilities": [0.0001, 0.0002, ...],
  "inferenceTimeMs": 34
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in:
# - apps/api/src/server.ts (PORT variable)
# - apps/web/vite.config.ts (server.port)
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Type Errors
```bash
# Type check and fix
pnpm type-check
# Fix TypeScript errors in IDE or manually
```

### API Not Connecting
```bash
# Verify API is running
curl http://localhost:3001/health

# Check frontend config
# apps/web/src/components/MNISTDigitRecognition.tsx
```

## 📖 Documentation Files

| File | Purpose | Length |
|------|---------|--------|
| [README.md](./README.md) | Project overview | 400+ lines |
| [docs/README.md](./docs/README.md) | Doc navigation | 250+ lines |
| [docs/MODEL_CARD.md](./docs/MODEL_CARD.md) | Model specs | 400+ lines |
| [docs/API_PERSISTENCE.md](./docs/API_PERSISTENCE.md) | API spec | 500+ lines |
| [docs/TESTING_REPORT.md](./docs/TESTING_REPORT.md) | QA report | 600+ lines |
| [apps/api/README.md](./apps/api/README.md) | Backend doc | 250+ lines |
| [apps/web/README.md](./apps/web/README.md) | Frontend doc | 250+ lines |
| [packages/shared/README.md](./packages/shared/README.md) | Types doc | 200+ lines |
| [packages/ml-core/README.md](./packages/ml-core/README.md) | ML doc | 300+ lines |

**Total: 2,908 lines | 100+ pages**

## 🎓 Learning Resources

- [tRPC Docs](https://trpc.io/)
- [Zod Docs](https://zod.dev/)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MNIST Dataset](http://yann.lecun.com/exdb/mnist/)
- [CNN Fundamentals](https://cs231n.github.io/)

## 🤝 Team Roles

### Frontend Developer
- Edit: `apps/web/src/`
- Read: `apps/web/README.md`
- Test: `apps/web/tests/`

### Backend Developer
- Edit: `apps/api/src/`
- Read: `apps/api/README.md` + `docs/API_PERSISTENCE.md`
- Test: `apps/api/tests/`

### ML Engineer
- Edit: `packages/ml-core/src/`
- Read: `docs/MODEL_CARD.md` + `packages/ml-core/README.md`
- Test: `packages/ml-core/tests/`

### DevOps / Security
- Read: `docs/API_PERSISTENCE.md`
- Review: Security tests in `docs/TESTING_REPORT.md`
- Configure: Deployment settings

## ✅ Pre-Commit Checklist

Before committing code:

```bash
# Type check
pnpm type-check

# Run tests
pnpm test

# Lint
pnpm lint

# Format
pnpm format
```

## 🚀 Deployment

### Development
```bash
pnpm run dev:api
pnpm run dev:web
```

### Production
```bash
pnpm build
# Deploy apps/api/dist and apps/web/dist
```

## 📞 Support

- **Questions?** Check relevant README
- **Bugs?** Open issue with "bug:" prefix
- **Features?** Open issue with "feature:" prefix
- **Security?** Contact security team

---

**Last Updated:** January 22, 2026  
**Status:** ✅ Production Ready
