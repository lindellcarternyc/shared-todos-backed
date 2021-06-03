import { Todo, TodoList } from '@prisma/client'
import { inject, injectable } from 'inversify';
import { PrismaService, PrismaServiceImpl } from '../../common/services/primsa.service';

interface CreateTodoList {
  userId: number
  todos: Array<{ task: string }>
}

interface CreateTodo {
  listId: number
  todo: { task: string }
}

export interface TodoListService {
  createTodoList(args: CreateTodoList): Promise<TodoList>
  createTodo(args: CreateTodo): Promise<Todo>
  getAllLists(): Promise<TodoList[]>
  getListById(id: number): Promise<TodoList | null>
  deleteAllTodoLists(): Promise<void>
}

@injectable()
export class TodoListServiceImpl implements TodoListService {
  constructor(@inject(PrismaServiceImpl) private readonly db: PrismaService) { }

  createTodoList: TodoListService['createTodoList'] = async (args) => {
    try {
      const emptyList = await this.db.connection.todoList.create({
        data: {
          createdBy: {
            connect: { id: args.userId }
          }
        }
      })

      for (const todo of args.todos) {
       await this.db.connection.todo.createMany({
          data: {
            task: todo.task,
            listId: emptyList.id
          }
        })
      }

      const newList = await this.db.connection.todoList.findFirst({
        where: { id: emptyList.id },
        include: {
          todos: true
        }
      })
      
      if (!newList) {
        throw new Error('Error creating list')
      }
      return newList
    } catch (err) {
      throw err
    }
  }

  getAllLists = async () => {
    const lists = await this.db.connection.todoList.findMany(
      { 
        include: {
          todos: true
        }
      }
    )
    return lists
  }
  
  getListById = async (id: number) => {
    return this.db.connection.todoList.findFirst({
      where: { id }
    })
  }

  createTodo = async (args: CreateTodo) => {
    const { listId, todo } = args
    try {
      if (await this.getListById(listId)) {
        const newTodo = await this.db.connection.todo.create({
          data: {
            task: todo.task,
            listId
          }
        })
        return newTodo
      }
      throw new Error(`Could not find list ${listId}`)
    } catch (err) {
      throw err
    }
  }

  deleteAllTodoLists = async () => {
    try {
      await this.db.connection.todo.deleteMany()
      await this.db.connection.todoList.deleteMany()
    } catch (err) {
      throw err
    }
  }
}