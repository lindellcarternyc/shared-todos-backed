import { inject, injectable } from "inversify"
import { ExpressFunc } from "../common/interfaces"
import { UserService, UserServiceImpl } from "./services/users.service"

export interface UsersController  {
  getUsers: ExpressFunc
  deleteUsers: ExpressFunc
}

@injectable()
export class UsersControllerImpl implements UsersController {
  private readonly usersService: UserService

  constructor(@inject(UserServiceImpl) userService: UserService) {
    this.usersService = userService
  }

  getUsers: ExpressFunc = async (req, res) => {
    const users = await this.usersService.getUsers()
    return res.status(200).send({ users })
  }

  deleteUsers: ExpressFunc = async (_, res) => {
    await this.usersService.deleteUsers()
    return res.status(203).send('DELETED ALL USERS')
  }
}