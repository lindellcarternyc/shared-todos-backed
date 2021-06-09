import { Role, User } from '@prisma/client'
import { inject, injectable } from 'inversify'
import dotEnv from 'dotenv'
import { PrismaServiceImpl } from '../../common/services/primsa.service'
import { hashPassword } from '../utils'

dotEnv.config()
const ADMIN_SECRET = process.env.ADMIN_SECRET!

interface RegisterArgs extends Omit<User, 'id'> {
  adminSecret?: string
}

export interface AuthService {
  register(args: RegisterArgs): Promise<User>
}

@injectable()
export class AuthServiceImpl implements AuthService {
  constructor(@inject(PrismaServiceImpl) private readonly db: PrismaServiceImpl) {

  }

  register = async (args: RegisterArgs) => {
    const roles: Role[] = ['USER']

    if (args.adminSecret && args.adminSecret === ADMIN_SECRET) {
      roles.push('ADMIN')
    }

    const password = await hashPassword(args.password)

    try {
      const user = await this.db.connection.user.create({
        data: {
          username: args.username,
          email: args.email,
          password,
          roles: roles
        }
      })

      return user
    } catch (err) {
      throw err
    }
  }
}