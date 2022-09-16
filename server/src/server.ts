import express  from 'express';
import { PrismaClient } from '@prisma/client'

const app = express()

app.use(express.json())

const prisma = new PrismaClient({
    log: ['query']
})

// HTTP methods / API RESTful / HTTP Codes 
// HTTP Codes = Que começam com 200(Sucesso) 300(Redirecionamento) 400(Erro de aplicação) 500(Erros inesperados)

// GET = Buscar informação.
// POST = Criar algum recurso.
// PUT = Editar várias entidades ao mesmo tempo.
// PATCH = Editar algo específico e simples.
// DELETE = remover alguma entidade do back-end.

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })

    return response.json(games);
});

app.post('/games/:id/ads', (request, response) => {
    const gameId = request.params.id;
    const body = request.body;



    return response.status(201).json(body);
});

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            gameId,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    return response.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(',')
        }
    }))
})

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })

    return response.json({
        discord: ad.discord,
    })
})

app.listen(3333)