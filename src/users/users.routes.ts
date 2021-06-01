import { RouterConfigImpl } from '../common/router.config'
import container from '../di.container'
import { UsersControllerImpl } from './users.controller'

const usersController = container.resolve(UsersControllerImpl)

export class UsersRouter extends RouterConfigImpl {
  constructor() {
    super('/users')
  }

  configureRouter() {
    this.router.route('/')
      .get(usersController.getUsers)
  }
}