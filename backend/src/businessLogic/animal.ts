import * as uuid from 'uuid'
import { AnimalItem } from '../models/AnimalItem'
import { AnimalUpdate } from '../models/AnimalUpdate'

import { AnimalAccess } from '../dataLayer/animalsAccess'

import { CreateAnimalRequest } from '../requests/CreateAnimalRequest'
import { UpdateAnimalRequest } from '../requests/UpdateAnimalRequest'

import { parseUserId } from '../auth/utils'

const animalAccess = new AnimalAccess()

export async function getAllAnimals(jwtToken: string): Promise<AnimalItem[]> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return animalAccess.getAllAnimals(userId)
}

export async function createAnimal(createAnimalRequest: CreateAnimalRequest, jwtToken: string): Promise<AnimalItem> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  const itemId = uuid.v4()

  return await animalAccess.createAnimal({
    animalId: itemId,
    userId: userId,
    name: createAnimalRequest.name,
    typeOfAnimal: createAnimalRequest.typeOfAnimal,
    statusAnimal:true,
    createdAt: new Date().toISOString()
  })
}

export async function updateAnimal(animalId: string, updateanimalRequest: UpdateAnimalRequest, jwtToken: string): Promise<AnimalUpdate> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return await animalAccess.updateAnimal(animalId, userId, updateanimalRequest)
}

export async function deleteAnimal(animalId: string, jwtToken: string): Promise<void> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return await animalAccess.deleteAnimal(animalId, userId)
}

export async function setAttachmentUrl(animalId: string, attachmentUrl: string, jwtToken: string): Promise<void> {
  const userId = parseUserId(jwtToken) // Use pre-made function
  return await animalAccess.setAttachmentUrl(animalId, userId, attachmentUrl)
}
