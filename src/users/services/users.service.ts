import { PrismaClient, User } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { PrismaService, PrismaServiceImpl } from '../../common/services/primsa.service'

export interface UserService {
  getUsers(): Promise<User[]>
  getUserById(id: number): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  getUserByUsername(username: string): Promise<User | null>
}

@injectable()
export class UserServiceImpl implements UserService {
  private readonly prisma: PrismaService

  constructor(@inject(PrismaServiceImpl) prisma: PrismaService) {
    this.prisma = prisma
  }

  getUsers = async () => {
    return await this.prisma.connection.user.findMany()
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
}