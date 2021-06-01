import express from  'express'
import { AuthRoutes } from './auth/auth.routes'
import { RouterConfig } from './common/router.config'
import { UsersRouter } from './users/users.routes'


// const DEFAULT_ROUTES: RouterConfig[] = [
//   new AuthRoutes(),
//   new UsersRouter(),
//   createDefaultRouter()
// ]

export const createApplication = () => {
  const app = express()
  app.use(express.json())

  const routes: RouterConfig[] = [
    new AuthRoutes(app),
    new UsersRouter(app)
  ]

  routes.forEach(route => {
    console.log(`Routes configured for '${route.getName()}'`)
  })


  return app
}

export const startApplication = (options: { port: string | number }) => {
  const app = createApplication()

  return app.listen(options.port, () => {
    console.log(`app listening at http://localhost:${options.port}`)
  })
}