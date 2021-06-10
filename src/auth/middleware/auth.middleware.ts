
import { Role } from '.prisma/client'
import { ExpressFunc } from '../../common/interfaces'
import { JWTData, parseToken } from '../utils'


export const validJWTRequired: ExpressFunc = (req, res, next) => {
  if (req.headers['authorization']) {
    const authorization = req.headers.authorization.split(' ')
    if (authorization[0] == 'Bearer') {
      try {
        const creds = parseToken(authorization[1])
        res.locals.jwt = creds
        return next()
      } catch (err) {
        return res.status(401).send('UNAUTHORIZED')
      }
    } else {
      return res.status(401).send('UNAUTHORIZED')
    }
  } else {
    return res.status(401).send('UNAUTHORIZED')
  }
}

export const requiresRoles = (requiredRoles: Role[]): ExpressFunc => {
  return (req, res, next) => {
    const { roles }= res.locals.jwt as JWTData
    
    for (const role of requiredRoles) {
      if (!roles.includes(role)) {
        return res.status(401).send('UNATHORIZED')
      }
    }

    return next()
  }
}

export const isSameUser: ExpressFunc = (req, res, next) => {
  const { userId } = req.params
  const { id } = res.locals.jwt

  if (parseInt(userId) === id) {
    return next()
  }

  return res.status(401).send('UNAUTHORIZED')
}