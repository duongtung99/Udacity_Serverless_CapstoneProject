import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult,APIGatewayProxyHandler } from 'aws-lambda'
import { CreateAnimalRequest } from '../../requests/CreateAnimalRequest'
import { createAnimal } from '../../businessLogic/animal'
import { createLogger } from '../../utils/logger'

const logger = createLogger('---------CreateAnimalHandler----------')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Starting create an animal for current user', event)

  // DONE: Implement creating new animal item
  const newAnimal: CreateAnimalRequest = JSON.parse(event.body)

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await createAnimal(newAnimal, jwtToken)

  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}