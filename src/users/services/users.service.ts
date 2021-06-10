import { PrismaClient, Role, TodoList, User } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { PrismaService, PrismaServiceImpl } from '../../common/services/primsa.service'

type APIUser = User & {
  createdLists: TodoList[]
  roles: Role[]
}

interface EmailGetUser {
  email: string
}

interface IdGetUser {
  id: User['id']
}

type GetUser 
  = EmailGetUser
  | IdGetUser

export interface UserService {
  // getUser(where: GetUser): Promise<APIUser | null>
  getUsers(): Promise<Omit<User, 'password'>[]>
  getUserById(id: IdGetUser['id']): Promise<APIUser | null>
  getUserByEmail(email: EmailGetUser['email']): Promise<APIUser | null>
  getUserByUsername(username: string): Promise<User | null>
  deleteUsers(): Promise<void>
}

interface WithPassword extends Record<string, any> {
  password: string
}

const removePassword = <T extends WithPassword, U = Omit<T, 'password'>>(obj: T): U => {
  return (Object.keys(obj)).reduce((res, key) => { 
    if (key === 'password') return res
    return {
      ...res,
      [key]: obj[key]
    }
  }, { } as U)
}

@injectable()
export class UserServiceImpl implements UserService {
  private readonly prisma: PrismaService

  private getUser = async (where: GetUser) => {
    try {
      const user = await this.prisma.connection.user.findFirst({
        where,
        include: {
          createdLists: {
            include: {
              todos: true
            }
          }
        }
      })
      return user
    } catch (err) {
      throw err
    }
  }

  constructor(@inject(PrismaServiceImpl) prisma: PrismaService) {
    this.prisma = prisma
  }

  getUsers = async () => {
    const users = await this.prisma.connection.user.findMany()
    return users.map(removePassword)
  }

  getUserById = async (id: number) => {
    const user = await this.getUser({ id })
    return user
  }

  getUserByEmail = async (email: string) => {
    const user = await this.getUser({ email })
    return user
  }

  getUserByUsername = async (username: string) => {
    return await this.prisma.connection.user.findFirst({
      where: { username }
    })
  }

  deleteUsers = async () => {
    await this.prisma.connection.user.deleteMany()
  }
}