import { PrismaClient, User } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { PrismaService, PrismaServiceImpl } from '../../common/services/primsa.service'

export interface UserService {
  getUsers(): Promise<Omit<User, 'password'>[]>
  getUserById(id: number): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
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

  constructor(@inject(PrismaServiceImpl) prisma: PrismaService) {
    this.prisma = prisma
  }

  getUsers = async () => {
    const users = await this.prisma.connection.user.findMany()
    return users.map(removePassword)
  }

  getUserById = async (id: number) => {
    return await this.prisma.connection.user.findFirst({
      where: { id }
    })
  }

  getUserByEmail = async (email: string) => {
    return await this.prisma.connection.user.findFirst({
      where: { email }
    })
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