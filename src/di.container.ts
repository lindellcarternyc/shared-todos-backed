import { Container } from 'inversify'
import { PrismaService, PrismaServiceImpl } from './common/services/primsa.service'
import { UserService, UserServiceImpl } from './users/services/users.service'
import { UsersController, UsersControllerImpl } from './users/users.controller'

const container = new Container()

container.bind<PrismaService>(PrismaServiceImpl).toSelf()
container.bind<UsersController>(UsersControllerImpl).toSelf()
container.bind<UserService>(UserServiceImpl).toSelf()

export default container