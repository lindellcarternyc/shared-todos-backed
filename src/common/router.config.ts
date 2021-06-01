import express from 'express'

export interface RouterConfig {
  getName(): string
  getRouter(): express.Router
}

export abstract class RouterConfigImpl implements RouterConfig {
  protected readonly router: express.Router
  private readonly name: string

  constructor(name: string, router: express.Router = express.Router()) {
    this.name = name
    this.router = router

    this.configureRouter()
  }

  getName = () => {
    return this.name
  }

  getRouter = () => {
    return this.router
  }

  abstract configureRouter(): void
}