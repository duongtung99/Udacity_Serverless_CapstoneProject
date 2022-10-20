import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteAnimal } from '../../businessLogic/animal'
import { createLogger } from '../../utils/logger'


const logger = createLogger('---------DeleteAnimalHandler----------')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Starting delete an animal for current user', event)

  // DONE: Remove an animal item by id
  const animalId = event.pathParameters.animalId

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  await deleteAnimal(animalId, jwtToken)

  return {
    statusCode: 204,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: ''
  }
})

handler.use(
  cors({
    credentials: true
  })
)
