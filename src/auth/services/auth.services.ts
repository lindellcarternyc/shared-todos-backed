import { User } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { PrismaServiceImpl } from '../../common/services/primsa.service'

type RegisterArgs 
  = Omit<User, 'id'>
export interface AuthService {
  register(args: RegisterArgs): Promise<number>
}

@injectable()
export class AuthServiceImpl implements AuthService {
  constructor(@inject(PrismaServiceImpl) private readonly db: PrismaServiceImpl) {

  }

  register = async (args: RegisterArgs) => {
    const password = args.password

    try {
      const user = await this.db.connection.user.create({
        data: {
          username: args.username,
          email: args.email,
          password
        }
      })

      return user.id
    } catch (err) {
      throw err
    }
  }
}