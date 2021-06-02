import { User } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { PrismaServiceImpl } from '../../common/services/primsa.service'
import { hashPassword } from '../utils'

type RegisterArgs 
  = Omit<User, 'id'>
export interface AuthService {
  register(args: RegisterArgs): Promise<User>
}

@injectable()
export class AuthServiceImpl implements AuthService {
  constructor(@inject(PrismaServiceImpl) private readonly db: PrismaServiceImpl) {

  }

  register = async (args: RegisterArgs) => {
    const password = await hashPassword(args.password)

    try {
      const user = await this.db.connection.user.create({
        data: {
          username: args.username,
          email: args.email,
          password
        }
      })

      return user
    } catch (err) {
      throw err
    }
  }
}