import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getTodos as getTodosForUser } from '../../BLL/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
import { ResponeHelpers } from '../../ResponeHelpers/responeHelpers';

// TODO: Get all TODO items for a current user
const logger = createLogger('GetTodosEvent')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Start process GetTodos event', { event })

  const userId = getUserId(event)
  const items = await getTodosForUser(userId)
  logger.info('End process GetTodos event', { event })
  return new ResponeHelpers().generateDataResponse(200,items); 
}