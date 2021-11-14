import { CarData } from "./getCarData";
import {getRandomNumberInRange} from './getCarData'

export const makeMockRequestData = (carData: CarData | null, address: string) => {
  const now = new Date()
  const formatedNow = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`
  return ({
    source_time: formatedNow,
    adresses: [
      {
        address,
        lat: carData?.lat,
        lon: carData?.lon,
      }
    ],
    crew_id: carData?.crew_id,
    order_id: getRandomNumberInRange(0, 99999).toFixed()
  })
}