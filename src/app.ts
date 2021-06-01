import express from  'express'
import { RouterConfig } from './common/router.config'
import { UsersRouter } from './users/users.routes'

const createDefaultRouter = (): RouterConfig => {
  const router = express.Router()

  router.get('/', (_, res) => {
    res.send('root')
  })

  return {
    getName() {
      return '/'
    },
    getRouter() {
      return router
    }
  }
}

const DEFAULT_ROUTES: RouterConfig[] = [
  new UsersRouter(),
  createDefaultRouter()
]

export const createApplication = (routes: RouterConfig[] = DEFAULT_ROUTES) => {
  const app = express()

  routes.forEach(route => {
    app.use(route.getName(), route.getRouter())
  })


  return app
}

export const startApplication = (options: { port: string | number }) => {
  const app = createApplication()

  return app.listen(options.port, () => {
    console.log(`app listening at http://localhost:${options.port}`)
  })
}