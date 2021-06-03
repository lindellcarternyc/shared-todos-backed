import express from 'express'

export interface RouterConfig {
  baseUrl: string
  getName(): string
  configureApp(): express.Application
}


export abstract class RouterConfigImpl implements RouterConfig {
  protected readonly name: string
  
  public readonly baseUrl: string

  constructor(name: string, baseUrl: string, protected readonly app: express.Application) {
    this.name = name
    this.baseUrl = baseUrl

    this.configureApp()
  }

  abstract configureApp(): express.Application

  getName = () => {
    return this.name
  }

  route = (path: string): string => {
    return this.baseUrl + path
  }
}