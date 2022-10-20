import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult,APIGatewayProxyHandler } from 'aws-lambda'
import { getAllAnimals } from '../../businessLogic/animal'
import { createLogger } from '../../utils/logger'


const logger = createLogger('---------GetAnimalsHandler----------')

export const handler : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Stating get all animals for current user', event)

  // DONE: Get all animals items

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const animals = await getAllAnimals(jwtToken)

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: animals
    })
  }
}
