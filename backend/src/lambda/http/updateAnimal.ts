import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult,APIGatewayProxyHandler } from 'aws-lambda'
import { UpdateAnimalRequest } from '../../requests/UpdateAnimalRequest'
import { updateAnimal } from '../../businessLogic/animal'
import { createLogger } from '../../utils/logger'

const logger = createLogger('---------UpdateAnimalHandler----------')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API calls
  logger.info('Starting update an animal for current user', event)

  // DONE: Update a animal item with the provided id using values in the "updatedAnimal" object
  const animalId = event.pathParameters.animalId
  const updatedAnimal: UpdateAnimalRequest = JSON.parse(event.body)

  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  await updateAnimal(animalId, updatedAnimal, jwtToken)
  logger.info('Ending update an animal for current user', event)
  return {
    statusCode: 204,
    headers:{
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}

