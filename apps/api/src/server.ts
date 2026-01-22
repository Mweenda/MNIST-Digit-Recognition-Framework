import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { mlRouter } from './routers/ml.router'

const server = createHTTPServer({
  router: mlRouter,
  createContext: () => ({}),
})

const PORT = parseInt(process.env.PORT || '3001', 10)

// Start server
console.log(`🚀 MNIST API Server running on http://localhost:${PORT}`)
console.log(`📊 Ready for predictions on /ml/predict`)

export default server
