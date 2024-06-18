import request from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import createApp from '@/app'
import { createFor } from '@tests/utils/records'
import { StatusCodes } from 'http-status-codes'

const db = await createTestDatabase()
const app = createApp(db)

const createMovies = createFor(db, 'movies')

beforeAll(async () => {
  await createMovies({
    id: 816692,
    title: 'Interstellar',
    year: 2014,
  })
})

describe('post', () => {
  it('should add new screening', async () => {
    const screeningData = {
      totalTickets: 50,
      timestamp: '2024-06-18T15:30:00Z',
      movieId: 816692,
    }

    const response = await request(app).post('/screenings').send(screeningData)

    expect(response.statusCode).toBe(StatusCodes.CREATED)
    expect(response.body).toEqual({
      id: 1,
      movieId: 816692,
      totalTickets: 50,
      remainingTickets: 50,
      timestamp: '2024-06-18T15:30:00Z',
    })
  })
})

describe('get', () => {
  it('should return all screenings', async () => {
    const response = await request(app).get('/screenings')
    console.log(response.body)

    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(response.body).toEqual([
      {
        totalTickets: 50,
        remainingTickets: 50,
        timestamp: '2024-06-18T15:30:00Z',
        title: 'Interstellar',
        year: 2014,
      },
    ])
  })
})
