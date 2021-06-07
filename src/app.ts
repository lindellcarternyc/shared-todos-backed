import express from  'express'
import morgan from 'morgan'

import { AuthRoutes } from './auth/auth.routes'
import { RouterConfig } from './common/router.config'
import { TodosRoutes } from './todo-lists/todo-lists.routes'
import { UsersRouter } from './users/users.routes'

export const createApplication = () => {
  const app = express()
  app.use(express.json())
  app.use(morgan('dev'))

  const routes: RouterConfig[] = [
    new AuthRoutes(app),
    new UsersRouter(app),
    new TodosRoutes(app)
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