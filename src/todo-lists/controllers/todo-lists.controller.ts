import { inject, injectable } from 'inversify'
import { ExpressFunc } from '../../common/interfaces';
import { TodoListService, TodoListServiceImpl } from '../services/todo-lists.services';

export interface TodoListController {
  createList: ExpressFunc
  getAllLists: ExpressFunc
  deleteAllLists: ExpressFunc
  createTodo: ExpressFunc
  updateTodo: ExpressFunc
}

@injectable()
export class TodoListControllerImpl implements TodoListController {
  constructor(@inject(TodoListServiceImpl) private readonly todoListService: TodoListService) { }

  createList: ExpressFunc = async (req, res) => {
    const userId = res.locals.jwt.id
    const todos = req.body.todos as Array<{task : string}>
    
    const newList = await this.todoListService.createTodoList({
      userId,
      todos
    })

    return res.status(201).send(newList)
  }

  getAllLists: ExpressFunc = async (req, res) => {
    try {
      const todoLists = await this.todoListService.getAllLists()
      return res.status(200).send({ todoLists })
    } catch (err) {
      throw err
    }
  }

  createTodo: ExpressFunc = async (req, res) => {
    try {
      const listId = parseInt(req.params.listId)
      
      const newTodo = await this.todoListService.createTodo({
        listId,
        todo: {
          task: req.body.task
        }
      })

      return res.status(201).send({ todo: newTodo })
    } catch (err) {
      return res.status(500).send('INTERNAL SERVER ERROR')
    }
  }

  deleteAllLists: ExpressFunc = async (req, res) => {
    try {
      await this.todoListService.deleteAllTodoLists()
      return res.status(203).send('DELETED ALL TODO LISTS')
    } catch (err) {
      return res.status(500).send({
        message: 'INTERNAL SERVER ERROR',
        err
      })
    }
  }

  updateTodo: ExpressFunc = async (req, res) => {
    const { todoId } = req.params

    try {
      const updatedTodo = await this.todoListService.updateTodo({
        todoId: parseInt(todoId),
        todo: req.body.todo
      })
      return res.status(200).send({
        todo: updatedTodo
      })
    } catch (err) {
      return res.status(500).send('Error updating todo')
    }
  }
}