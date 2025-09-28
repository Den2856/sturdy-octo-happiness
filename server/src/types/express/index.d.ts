import 'express-serve-static-core'

declare module 'express-serve-static-core' {
  interface Request {
    /** Записывает authMiddleware */
    userId?: string
  }
}
