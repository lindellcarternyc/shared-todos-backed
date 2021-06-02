import { inject, injectable } from 'inversify'
import { ExpressFunc } from '../../common/interfaces'
import { UserService, UserServiceImpl } from '../../users/services/users.service'
import { AuthService, AuthServiceImpl } from '../services/auth.services'
import { comparePassword } from '../utils'

interface AuthResponse {
  id: number
  token: {
    authToken: string
    refreshToken: string
  }
}

export interface AuthController {
  register: ExpressFunc
  login: ExpressFunc
}

@injectable()
export class AuthControllerImpl implements AuthController {
  constructor(
    @inject(AuthServiceImpl) private readonly authService: AuthService,
    @inject(UserServiceImpl) private readonly userService: UserService
    ) {

  }

  register: ExpressFunc = async (req, res) => {
    try {
      const userId = await this.authService.register(req.body)
      const authRes: AuthResponse = {
        id: userId,
        token: {
          authToken: 'AUTHTOKEN',
          refreshToken: 'REFRESHTOKEN'
        }
      }
      return res.status(201).send(authRes)
    } catch(err) {
      return res.status(500).send('INTERAL ERROR')
    }
  }

  login: ExpressFunc = async (req, res) => {
    try {
      const user = await this.userService.getUserByEmail(req.body.email)
      if (user) {
        const authRes: AuthResponse = {
          id: user.id,
          token: {
            authToken: 'AUTHTOKEN',
            refreshToken: 'REFRESHTOKEN'
          }
        }

        const isCorrectPassword = await comparePassword(req.body.password, user.password)
        if (isCorrectPassword) {
          return res.status(200).send(authRes)
        }
      }
      return res.status(401).send('WRONG EMAIL OR PASSWORD')
    } catch (err) {
      return res.status(500).send('INTERNAL ERROR')
    }
  }
}