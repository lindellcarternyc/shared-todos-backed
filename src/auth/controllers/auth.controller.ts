import { inject, injectable } from 'inversify'
import { ExpressFunc } from '../../common/interfaces'
import { AuthService, AuthServiceImpl } from '../services/auth.services'

interface AuthResponse {
  id: number
  token: {
    authToken: string
    refreshToken: string
  }
}

export interface AuthController {
  register: ExpressFunc
}

@injectable()
export class AuthControllerImpl implements AuthController {
  constructor(@inject(AuthServiceImpl) private readonly authService: AuthService) {

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
}