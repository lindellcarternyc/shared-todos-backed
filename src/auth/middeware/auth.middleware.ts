
import { ExpressFunc } from '../../common/interfaces'
import { parseToken } from '../utils'


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
