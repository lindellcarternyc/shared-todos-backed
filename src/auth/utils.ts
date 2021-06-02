import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AuthToken } from './interfaces'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET!

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12)
}

export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashed)
}

interface CreateTokenArgs {
  id: number
  email: string
  password: string
  username: string
}

export const createToken = (args: CreateTokenArgs): AuthToken => {
  const refreshId = args.id.toString() + JWT_SECRET
  const salt = crypto.createSecretKey(crypto.randomBytes(16))
  const hash = crypto
    .createHmac('sha512', salt)
    .update(refreshId)
    .digest('base64')

  const refreshKey = salt.export()
  
  const token = jwt.sign({
    ...args,
    refreshKey
  }, JWT_SECRET!, {
    expiresIn: 36_000
  })

  return {
    authToken: token,
    refreshToken: hash
  }
}

export interface JWTData {
  id: number
  refreshKey: Buffer
  iat: number
  exp: number
}

export const parseToken = (token: string): JWTData => {
  try {
    const data = jwt.verify(token, JWT_SECRET)
    return data as JWTData
  } catch (err) {
    console.error(err)
    throw err
  }
}