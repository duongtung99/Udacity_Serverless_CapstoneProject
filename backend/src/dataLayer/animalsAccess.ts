import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { AnimalItem } from '../models/AnimalItem'
import { AnimalUpdate } from '../models/AnimalUpdate'

const logger = createLogger('AnimalsAccessLayer')
const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET

export class AnimalAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly animalsTable = process.env.ANIMALS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) { }

  async getAllAnimals(userId: string): Promise<AnimalItem[]> {
    logger.info(`Start getting all animals for user ${userId} from ${this.animalsTable} table`)

    const result = await this.docClient.query({
      TableName: this.animalsTable,
      IndexName: this.userIdIndex, // For faster query retrival
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
      ScanIndexForward: false // To retrive latest animals at the top
    }).promise()

    const items = result.Items
    return items as AnimalItem[]
  }

  async createAnimal(animalItem: AnimalItem): Promise<AnimalItem> {
    await this.docClient.put({
      TableName: this.animalsTable,
      Item: animalItem
    }).promise()

    return animalItem
  }

  async updateAnimal(animalId: string, userId: string, animalUpdate: AnimalUpdate): Promise<AnimalUpdate> {
    await this.docClient.update({
      TableName: this.animalsTable,
      Key: {
        animalId,
        userId
      },
      UpdateExpression: 'set #n = :name, statusAnimal = :statusAnimal, typeOfAnimal = :typeOfAnimal',
      ExpressionAttributeValues: {
        ':name': animalUpdate.name,
        ':statusAnimal': animalUpdate.statusAnimal,
        ':typeOfAnimal': animalUpdate.typeOfAnimal
      },
      ExpressionAttributeNames: { '#n': 'name' },
      ReturnValues: 'UPDATED_NEW',
    }).promise()

    return animalUpdate
  }

  async deleteAnimal(animalId: string, userId: string): Promise<void> {
    // DONE: If item has image, delete attached image from s3
    // Get animal item of interest
    const result = await this.docClient.get({
      TableName: this.animalsTable,
      Key: {
        animalId,
        userId
      }
    }).promise()

    if (result) {
      if (result.Item.attachmentUrl) {
        // Get ending of URL
        const imageUrl = result.Item.attachmentUrl
        const imageKey = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
        logger.info('Deleting attached image from s3: ', imageKey)
        // Use function to delete image from s3
        deleteS3AttachedImage(bucketName, imageKey)
      }
    }

    await this.docClient.delete({
      TableName: this.animalsTable,
      Key: {
        animalId,
        userId
      }
    }).promise()
  }

  async setAttachmentUrl(animalId: string, userId: string, attachmentUrl: string): Promise<void> {
    // DONE: If pre-existing image, delete attached image from s3
    // Get animal item of interest
    logger.info('Starting set attachment url')
    const result = await this.docClient.get({
      TableName: this.animalsTable,
      Key: {
        animalId,
        userId
      }
    }).promise()

    if (result) {
      if (result.Item.attachmentUrl) {
        // Get ending of URL
        const imageUrl = result.Item.attachmentUrl
        const imageKey = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
        logger.info('Deleting attached image from s3: ', imageKey)
        // Use function to delete image from s3
        deleteS3AttachedImage(bucketName, imageKey)
      }
    }

    await this.docClient.update({
      TableName: this.animalsTable,
      Key: {
        animalId,
        userId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance ')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

// Function deletes an object from an s3 bucket
function deleteS3AttachedImage(bucket: string, key: string) {
  s3.deleteObject({ Bucket: bucket, Key: key }, function (err, data) {
    if (err) logger.info(err, err.stack) // an error occurred
    else logger.info(data) // successful response
  })
}
