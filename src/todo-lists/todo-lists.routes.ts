import express from 'express'
import * as yup from 'yup'
import { validate } from 'express-yup'

import { RouterConfigImpl } from '../common/router.config'
import { validJWTRequired } from '../auth/middleware/auth.middleware'
import container from '../di.container'
import { TodoListControllerImpl } from './controllers/todo-lists.controller'
import { UsersMiddleware, UsersMiddlewareImpl } from '../users/middleware/users.middleware'

const todoSchema = yup.object().shape({
  task: yup.string().required().min(5).max(25)
})

const createTodoSchema = yup.object().shape({
  body: todoSchema
})

const createListSchema = yup.object().shape({
  body: yup.object().shape({
    todos: yup.array().of(
      todoSchema
    ).required()
  }).required()
})

const updateTodoSchema = yup.object().shape({
  body: yup.object().shape({
    todo: yup.object().shape({
      task: yup.string().min(5).max(25),
      completed: yup.boolean()
    }).required()
  }).required()
})

const todoListController = container.resolve(TodoListControllerImpl)

const usersMiddleware = container.resolve<UsersMiddleware>(UsersMiddlewareImpl)

export class TodosRoutes extends RouterConfigImpl {
  constructor(app: express.Application) {
    super('todos.routes', '/todo-lists', app)
  }

  configureApp() {
    this.app.route(this.route(''))
      .all(
        validJWTRequired,
        usersMiddleware.userExists
      )
      .get(
        todoListController.getAllLists
      )
      .delete(
        todoListController.deleteAllLists
      )

    this.app.route(this.route(`/new-list`))
      .post(
        validJWTRequired,
        usersMiddleware.userExists,
        validate(createListSchema),
        todoListController.createList
      )

    this.app.route(this.route(`/:listId/new-todo`))
        .post(
          validJWTRequired,
          usersMiddleware.userExists,
          validate(createTodoSchema),
          todoListController.createTodo
        )

    this.app.route(this.route(`/:listId/todos/:todoId`))
      .all(
        validJWTRequired, 
        usersMiddleware.userExists, 
        usersMiddleware.userOwnsList
      )
      .get(todoListController.getTodo)
      .patch(
        validate(updateTodoSchema),
        todoListController.updateTodo
      )
      .delete(todoListController.deleteTodo)

    return this.app
  }
}