import { inject, injectable } from 'inversify'
import { ExpressFunc } from '../../common/interfaces';
import { TodoListService, TodoListServiceImpl } from '../services/todo-lists.services';

export interface TodoListController {
  createList: ExpressFunc
}

@injectable()
export class TodoListControllerImpl implements TodoListController {
  constructor(@inject(TodoListServiceImpl) private readonly todoListService: TodoListService) { }

  createList: ExpressFunc = async (req, res) => {
    const userId = res.locals.jwt.id
    const todos = req.body.todos as Array<{task : string}>
    
    const newList = await this.todoListService.createTodo({
      userId,
      todos
    })

    return res.status(201).send(newList)
  }
}