import express from 'express'
import { validJWTRequired } from '../auth/middeware/auth.middleware'
import { RouterConfigImpl } from '../common/router.config'
import container from '../di.container'
import { UsersControllerImpl } from './users.controller'

const usersController = container.resolve(UsersControllerImpl)

export class UsersRouter extends RouterConfigImpl {
  constructor(app: express.Application) {
    super('users.routes', '/users', app)
  }

  configureApp() {
    this.app.route('/users')
      .get(usersController.getUsers)
      .delete([
        validJWTRequired,
        usersController.deleteUsers
      ])
    return this.app
  }
}