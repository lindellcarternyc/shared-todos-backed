import { TodoList } from '@prisma/client'
import { inject, injectable } from 'inversify';
import { PrismaService, PrismaServiceImpl } from '../../common/services/primsa.service';

interface CreateTodoList {
  userId: number
  todos: Array<{ task: string }>
}

export interface TodoListService {
  createTodo(args: CreateTodoList): Promise<TodoList>
}

@injectable()
export class TodoListServiceImpl implements TodoListService {
  constructor(@inject(PrismaServiceImpl) private readonly db: PrismaService) { }

  createTodo: TodoListService['createTodo'] = async (args) => {
    try {
      const emptyList = await this.db.connection.todoList.create({
        data: {
          createdBy: {
            connect: { id: args.userId }
          }
        }
      })

      for (const todo of args.todos) {
        const newTodo = await this.db.connection.todo.createMany({
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
}