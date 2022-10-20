import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult,APIGatewayProxyHandler } from 'aws-lambda'

import { setAttachmentUrl } from '../../businessLogic/animal'
import { createLogger } from '../../utils/logger'

import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const logger = createLogger('---------GenerateUploadUrlHandler----------')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Starting generate upload url', event)

  // DONE: Return a presigned URL to upload a file for an animal item with the provided id
  const animalId = event.pathParameters.animalId
  // Get auth token for user
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  // Create an image start
  const imageId = uuid.v4()
  setAttachmentUrl(
    animalId,
    `https://${bucketName}.s3.amazonaws.com/${imageId}.png`,
    jwtToken
  )
  const uploadUrl = getUploadUrl(imageId)
  // Create an image end
  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: Number(urlExpiration) // convert string to int
  })
}
