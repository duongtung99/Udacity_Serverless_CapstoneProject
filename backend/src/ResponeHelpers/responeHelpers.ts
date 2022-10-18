import {APIGatewayProxyResult } from 'aws-lambda'

export class ResponeHelpers {
    generateDataResponse(statusCode: number,items: any): APIGatewayProxyResult{
        return{
            statusCode: statusCode,
            headers:{
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify(items)
          }
    }

    /**
     * generate empty response
     * @param statusCode Response http status code
     */
    generateEmptyResponse(statusCode: number): APIGatewayProxyResult{
        return{
            statusCode: statusCode,
            headers:{
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Allow-Credentials': true
            },
            body: null
          }
    }

    /**
     * generate error response
     * @param statusCode Response http status code
     * @param message Error message
     */
    generateErrorResponse(statusCode: number,message:string): APIGatewayProxyResult{
        return{
            statusCode: statusCode,
            headers:{
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
              message
            })
          }
    }
}