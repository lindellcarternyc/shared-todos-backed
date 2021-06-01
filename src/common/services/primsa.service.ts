import { PrismaClient } from '@prisma/client'
import { injectable } from 'inversify';

export interface PrismaService {
  connection: PrismaClient
}

@injectable()
export class PrismaServiceImpl implements PrismaService {
  public readonly connection: PrismaClient = new PrismaClient()
}