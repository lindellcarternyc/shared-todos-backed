import { Container } from 'inversify'
import { AuthController, AuthControllerImpl } from './auth/controllers/auth.controller'
import { AuthService, AuthServiceImpl } from './auth/services/auth.services'
import { PrismaService, PrismaServiceImpl } from './common/services/primsa.service'
import { UserService, UserServiceImpl } from './users/services/users.service'
import { UsersController, UsersControllerImpl } from './users/users.controller'

import dotenv from 'dotenv'
import { TodoListController, TodoListControllerImpl } from './todo-lists/controllers/todo-lists.controller'
import { TodoListService, TodoListServiceImpl } from './todo-lists/services/todo-lists.services'
dotenv.config()

const container = new Container()

container.bind<PrismaService>(PrismaServiceImpl).toSelf()

container.bind<UsersController>(UsersControllerImpl).toSelf()
container.bind<UserService>(UserServiceImpl).toSelf()

container.bind<AuthController>(AuthControllerImpl).toSelf()
container.bind<AuthService>(AuthServiceImpl).toSelf()

container.bind<TodoListController>(TodoListControllerImpl).toSelf()
container.bind<TodoListService>(TodoListServiceImpl).toSelf()

export default container