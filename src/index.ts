import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient, Todo } from '@prisma/client'

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

interface CreateTodoBody {
  title: string;
}

interface UpdateTodoBody {
  completed: boolean;
}

interface Params {
  id: string;
}

fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: 'Hello from Fastify and Prisma!' };
});

fastify.get('/todos', async(request: FastifyRequest, reply: FastifyReply) => {
  const todos: Todo[] = await prisma.todo.findMany();
  return todos;
});

fastify.post(
  '/todos',
  async (request: FastifyRequest<{ Body: CreateTodoBody }>, reply: FastifyReply) => {
    const { title } = request.body;
    const newTodo = await prisma.todo.create({
      data: { title },
    });

    return newTodo;
  },
);

fastify.put(
  '/todos/:id',
  async (request: FastifyRequest<{ Params: Params, Body: UpdateTodoBody }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { completed } = request.body;
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { completed },
    });
    
    return updatedTodo;
  },
);

fastify.delete(
  '/todos/:id',
  async (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
    const { id } = request.params;
    await prisma.todo.delete({
      where: { id: parseInt(id) }
    });

    return { message: 'Todo deleted' };
  },
);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
