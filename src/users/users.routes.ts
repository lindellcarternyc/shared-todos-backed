import express from 'express'
import { isSameUser, requiresRoles, validJWTRequired } from '../auth/middleware/auth.middleware'
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
      .all(
        validJWTRequired,
        requiresRoles(['ADMIN'])
      )
      .get(
        usersController.getUsers
      )
      .delete(
        usersController.deleteUsers
      )

    this.app.route(`/users/:userId`)
        .get(
          validJWTRequired,
          isSameUser,
          (req, res, next) => {
            console.log(res.locals)
          }
        )
    return this.app
  }
}