import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { mlRouter } from './routers/ml.router'

const server = createHTTPServer({
  router: mlRouter,
  createContext: () => ({}),
})

const PORT = process.env.PORT || 3001

server.listen(PORT as number, () => {
  console.log(`🚀 MNIST API Server running on http://localhost:${PORT}`)
  console.log(`📊 Ready for predictions on /ml/predict`)
})
