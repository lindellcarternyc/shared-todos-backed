import { inject, injectable } from 'inversify'
import { ExpressFunc } from '../../common/interfaces'
import { UserService, UserServiceImpl } from '../services/users.service'

export interface UsersMiddleware {
  userExists: ExpressFunc
}

@injectable()
export class UsersMiddlewareImpl implements UsersMiddleware {
  constructor(
    @inject(UserServiceImpl) private readonly usersService: UserService
  ) { }
  userExists: ExpressFunc = async (req, res, next) => {
    const userId = res.locals.jwt.id
    
    const user = await this.usersService.getUserById(userId)

    if (user) {
      return next()
    }

    return res.status(404).send('NO USER FOUND')
  }
}