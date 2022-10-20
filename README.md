# Capstone Serverless Project

This repo is for a simple **Animal Manager** application using AWS Lambda and Serverless framework.

# Functionality of the application

This application will allow creating/removing/updating/fetching animal items. Each animal item can optionally have an attachment image. Each user only has access to the animal items that he/she has created.

# Animal items

The application stores Animal items, where each Animal item contains the following fields:

* `animalId` (string) - a unique id for a Animal item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a Animal item (e.g. "Salad wrap")
* `typeofAnimal` (string) - day of the week on which the Animal is to be eaten (default: the day of item creation)
* `statusAnimal` (boolean) - true if Animal item has been eaten, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Animal item
* `userId` (string) - id of a user who created a Animal item.

# Functions implemented

The `serverless.yml` file has the following functions:

* `Auth` - a custom authorizer for API Gateway that is added to all other functions.

* `GetAnimals` -  returns all Animals for a current user. A user id can be extracted from a JWT token that is sent by the frontend.

* `CreateAnimal` - creates a new Animal for a current user. The shape of data sent by a client application to this function can be found in the `CreateAnimalRequest.ts` file. It receives a new Animal item to be created in JSON format.

* `UpdateAnimal` - updates a Animal item created by a current user. The shape of data sent by a client application to this function can be found in the `UpdateAnimalRequest.ts` file. It receives an object that contains three fields that can be updated in a Animal item. The id of an item that should be updated is passed as a URL parameter.

* `DeleteAnimal` - deletes a Animal item created by a current user. Expects an id of a Animal item to remove. Also deletes any attached image from the S3 bucket.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a Animal item. An id of a user can be extracted from a JWT token passed by a client. Also deletes any previously attached image from the S3 bucket to make room for new image.

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project. The only file that you need to edit is the `config.ts` file in the `client` folder.

## Authentication

This application implements authentication via an Auth0 application. The "domain" and "client id" is copied to the `config.ts` file in the `client` folder. This project uses asymmetrically encrypted JWT tokens.

# Best practices

The following best practices, suggested in the 6th lesson of the Udacity Cloud Developer Nanodegree, have been implemented as follows:

## Logging

The starter code came with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. It can write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

## Local Secondary Index

To store Animal items, a DynamoDB table with local secondary index(es) has been used.

```yml

AnimalsTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.Animals_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index

```

## Using Query()

The `query()` method is used to query an index as follows:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```
