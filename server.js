import { fastify } from 'fastify'
import { DatabaseMemory } from './database-memory.js'
import { DatabasePostgres } from './database-postgres.js'

// Importa o Fastify
const fastify = require('fastify')({ logger: true });

const server = fastify()

// Define a porta, utilizando variável de ambiente se disponível
const port = process.env.PORT || 4000;

//const database = new DatabaseMemory()

const database = new DatabasePostgres()

// Inicia o servidor, escutando em '0.0.0.0' para tornar acessível publicamente
const start = async () => {
  try {
    await fastify.listen({ port: port, host: '0.0.0.0' });
    fastify.log.info(`Server is running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

server.post('/videos', async (request, reply) => {
    const {title, description, duration} = request.body


    await database.create({
        title,
        description,
        duration,
    })

    return reply.status(201).send()
})


server.get('/videos', async (request) => {
    const search = request.query.search

    
    const videos = await database.list(search)


    return videos
})

server.put('/videos/:id', async (request, reply) => {
    const videoId = request.params.id
    const {title, description, duration} = request.body

   await database.update(videoId, {
        title,
        description,
        duration,
    })

    return reply.status(204).send()
})

server.delete('/videos/:id', (request, reply) => {
    const videoId = request.params.id

    database.delete(videoId)

    return reply.status(204).send()
    
})

server.listen ({
    port: process.env.PORT
})

