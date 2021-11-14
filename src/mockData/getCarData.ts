import { Coordinates } from "../App"

const carNames = {
  Renault: 'Logan',
  Kia: 'Sportage',
  Lada: 'Granta',
  Daewoo: 'Nexia',
  Chevrolet: 'Lacetti'
} as const

export const carColors = {
  'оранжевый': 'orange',
  'красный': 'red',
  'черный': 'black',
  'зеленый': 'green',
  'синий': 'blue'
} as const

const driverNames = ['Иванов', 'Петров', 'Cидоров', 'Мельников']

type CarMarks = keyof typeof carNames
type CarNames = typeof carNames[CarMarks]
type CarColor = keyof typeof carColors

export interface CarData {
  crew_id: string;
  car_mark: CarMarks;
  car_name: CarNames;
  car_color: CarColor;
  lat: Coordinates[0];
  lon: Coordinates[1];
  driver_name: string;
  driver_phone: string;
  distance: number;
  car_number: string;
}

export const getRandomNumberInRange = (min: number, max: number) => (Math.random() * (max - min) + min)

export const getRandomValue = <T>(arr: T[]) => {
  const randIndex = Math.floor(getRandomNumberInRange(0, arr.length))
  return arr[randIndex]
}

export const getRandomChar = (length: number, characters: string = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ') => {
  let result = ''
  let charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result 
}

export const getRandomCarNumber = () => {
  return `${getRandomChar(1)}${Math.floor(getRandomNumberInRange(0, 999))}${getRandomChar(2)}`
}

export const getCarData = (current: Coordinates | null, ymapIns: any): Promise<CarData[] | null> => {
  const data = current && [...new Array(4)]
  .map(() => {
    const carCoord = [current[0] + getRandomNumberInRange(-0.05, 0.05), current[1] + getRandomNumberInRange(-0.05, 0.05)]
    const carMark = getRandomValue(Object.keys(carNames) as CarMarks[])
    const distance = ymapIns.coordSystem.geo.getDistance(current, carCoord)
    return ({
      crew_id: `${Math.floor(getRandomNumberInRange(0, 1000))}`,
      lat: carCoord[0],
      lon: carCoord[1],
      car_mark: carMark,
      car_name: carNames[carMark],
      car_color: getRandomValue(Object.keys(carColors) as CarColor[]),
      driver_name: getRandomValue(driverNames),
      driver_phone: `8-999-${getRandomChar(9, '0123456789')}`,
      distance,
      car_number: getRandomCarNumber()
    })
  })
  .sort((a, b) => a.distance - b.distance)
  return new Promise((resolve) => setTimeout(() => resolve(data), 1000))
}
