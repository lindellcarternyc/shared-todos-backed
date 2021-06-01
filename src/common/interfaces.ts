import express from 'express'

export type ExpressFuncReturnType
  = void
  | Promise<void>
  | express.Response
  | Promise<express.Response>

export type ExpressFunc = (
  req: express.Request, 
  res: express.Response, 
  next: express.NextFunction
) => ExpressFuncReturnType