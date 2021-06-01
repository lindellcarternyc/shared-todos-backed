import express from 'express'

export interface RouterConfig {
  getName(): string
  configureApp(): express.Application
}

export abstract class RouterConfigImpl implements RouterConfig {
  protected readonly app: express.Application
  private readonly name: string

  constructor(name: string, app: express.Application) {
    this.name = name
    this.app = app

    this.configureApp()
  }

  getName = () => {
    return this.name
  }

  abstract configureApp(): express.Application
}