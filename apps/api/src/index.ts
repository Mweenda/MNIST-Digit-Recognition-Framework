import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { mlRouter } from './routers/ml.router'

const server = createHTTPServer({
  router: mlRouter,
  createContext() {
    return {}
  },
})

const PORT = 3001

server.listen(PORT)
console.log(`🚀 MNIST API Server running on http://localhost:${PORT}`)
console.log(`📊 tRPC endpoint: http://localhost:${PORT}/trpc`)
