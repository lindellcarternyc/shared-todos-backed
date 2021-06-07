import { User } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { ExpressFunc } from '../../common/interfaces'
import { UserService, UserServiceImpl } from '../services/users.service'

export interface UsersMiddleware {
  userExists: ExpressFunc
  userOwnsList: ExpressFunc
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

  userOwnsList: ExpressFunc = async (req, res, next) => {
    const userId = res.locals.jwt.id

    const user = await this.usersService.getUserById(userId)

    const listId = parseInt(req.params.listId)

    if (user) {
      for (const list of user.createdLists) {
        if (list.id === listId) {
          return next()
        }
      }
    }

    return res.status(403).send('FORBIDDEN')
  }
}