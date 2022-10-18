import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../BLL/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { ResponeHelpers } from '../../ResponeHelpers/responeHelpers';

const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Start process DeleteTodo event', { event })
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  await deleteTodo(userId, todoId)
  logger.info('End process DeleteTodo event', { event })
  return new ResponeHelpers().generateEmptyResponse(204);
}
