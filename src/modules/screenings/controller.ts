import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'
import * as schema from './schema'
import { StatusCodes } from 'http-status-codes'

export default (db: Database) => {
  const screenings = buildRespository(db)
  const router = Router()

  router
    .route('/')
    .get(jsonRoute(screenings.findAllAvailable))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)
        return await screenings.create(body)
      }, StatusCodes.CREATED)
    )

  return router
}
