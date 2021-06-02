import express from 'express'
import * as yup from 'yup'
import { validate } from 'express-yup'

import { RouterConfigImpl } from '../common/router.config'
import container from '../di.container'
import { AuthControllerImpl } from './controllers/auth.controller'

const registerSchema = yup.object().shape({
  body: yup.object().shape({ 
    username: yup.string()
      .required()
      .min(5)
      .max(25),
    email: yup.string()
      .email()
      .required(),
    password: yup.string()
      .required()
      .min(5)
      .max(25)
  }).required()
})

const loginSchema = yup.object().shape({
  body: yup.object().shape({ 
    email: yup.string().email().required(),
    password: yup.string().required()
  }).required()
})

const authController = container.resolve(AuthControllerImpl)

export class AuthRoutes extends RouterConfigImpl {
  constructor(app: express.Application) {
    super(`auth.routes`, app)
  }

  configureApp() {
    this.app.post(`/auth/register`, [
      validate(registerSchema),
      authController.register
    ])

    this.app.post(`/auth/login`, [
      validate(loginSchema),
      authController.login
    ])
    return this.app
  }
}