import express from 'express'
import * as yup from 'yup'
import { validate } from 'express-yup'

import { RouterConfigImpl } from '../common/router.config'
import { validJWTRequired } from '../auth/middeware/auth.middleware'
import container from '../di.container'
import { TodoListControllerImpl } from './controllers/todo-lists.controller'

const createListSchema = yup.object().shape({
  body: yup.object().shape({
    todos: yup.array().of(
      yup.object().shape({
        task: yup.string().required().min(5).max(25)
      })
    ).required()
  }).required()
})

const todoListController = container.resolve(TodoListControllerImpl)

export class TodosRoutes extends RouterConfigImpl {
  constructor(app: express.Application) {
    super('todos.routes', app)
  }

  configureApp() {

    this.app.route(`/todos/new-list`)
      .post([
        validJWTRequired,
        validate(createListSchema),
        todoListController.createList
      ])
    return this.app
  }
}