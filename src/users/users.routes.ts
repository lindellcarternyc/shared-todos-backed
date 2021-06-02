import express from 'express'
import { RouterConfigImpl } from '../common/router.config'
import container from '../di.container'
import { UsersControllerImpl } from './users.controller'

const usersController = container.resolve(UsersControllerImpl)

export class UsersRouter extends RouterConfigImpl {
  constructor(app: express.Application) {
    super('users.routes', app)
  }

  configureApp() {
    this.app.route('/users')
      .get(usersController.getUsers)
      .delete(usersController.deleteUsers)
    return this.app
  }
}