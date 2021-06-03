import express, { IRoute, IRouterHandler } from 'express'

export type ExpressFuncReturnType
  = void
  | Promise<void>
  | express.Response
  | Promise<express.Response>
  | any

export type ExpressFunc = (
  req: express.Request, 
  res: express.Response, 
  next: express.NextFunction
) => ExpressFuncReturnType