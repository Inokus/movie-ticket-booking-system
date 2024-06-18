import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import buildRepository from '../repository'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createMovies = createFor(db, 'movies')
const createScreenings = createFor(db, 'screenings')

beforeAll(async () => {
  await createMovies([
    {
      id: 816692,
      title: 'Interstellar',
      year: 2014,
    },
    {
      id: 133093,
      title: 'The Matrix',
      year: 1999,
    },
    {
      id: 234,
      title: 'Sherlock Holmes',
      year: 2009,
    },
  ])
  await createScreenings([
    {
      totalTickets: 50,
      remainingTickets: 0,
      timestamp: '2024-06-18T15:30:00Z',
      movieId: 816692,
    },
    {
      totalTickets: 100,
      remainingTickets: 1,
      timestamp: '2024-06-19T15:30:00Z',
      movieId: 133093,
    },
  ])
})

describe('findAllAvailable', () => {
  it('should return all available screenings', async () => {
    const screenings = await repository.findAllAvailable()

    expect(screenings).toEqual([
      {
        totalTickets: 100,
        remainingTickets: 1,
        timestamp: '2024-06-19T15:30:00Z',
        title: 'The Matrix',
        year: 1999,
      },
    ])
  })
})

describe('createScreening', () => {
  it('should add new screening', async () => {
    const screenings = await repository.create({
      totalTickets: 80,
      timestamp: '2024-06-20T15:30:00Z',
      movieId: 234,
    })

    expect(screenings).toEqual({
      id: 3,
      totalTickets: 80,
      remainingTickets: 80,
      timestamp: '2024-06-20T15:30:00Z',
      movieId: 234,
    })
  })
})

describe('deleteScreening', () => {
  it('should remove screening', async () => {
    const screenings = await repository.remove(1)

    expect(screenings).toEqual({
      id: 1,
      totalTickets: 50,
      remainingTickets: 0,
      timestamp: '2024-06-18T15:30:00Z',
      movieId: 816692,
    })
  })
})
