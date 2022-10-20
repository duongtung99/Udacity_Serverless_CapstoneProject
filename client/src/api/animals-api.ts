import { apiEndpoint } from '../config'
import { Animal } from '../types/Animal';
import { CreateAnimalRequest } from '../types/CreateAnimalRequest';
import Axios from 'axios'
import { UpdateAnimalRequest } from '../types/UpdateAnimalRequest';

export async function getAnimals(idToken: string): Promise<Animal[]> {
  console.log('Fetching animals')

  const response = await Axios.get(`${apiEndpoint}/animals`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Animals:', response.data)
  return response.data.items
}

export async function createAnimal(
  idToken: string,
  newAnimal: CreateAnimalRequest
): Promise<Animal> {
  const response = await Axios.post(`${apiEndpoint}/animals`,  JSON.stringify(newAnimal), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchAnimal(
  idToken: string,
  animalId: string,
  updatedAnimal: UpdateAnimalRequest
): Promise<void> {
  console.log(JSON.stringify(updatedAnimal));
  await Axios.patch(`${apiEndpoint}/animals/${animalId}`, JSON.stringify(updatedAnimal), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteAnimal(
  idToken: string,
  animalId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/animals/${animalId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  animalId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/animals/${animalId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
