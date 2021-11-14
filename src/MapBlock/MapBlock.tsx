import { FormInstance, List } from 'antd';
import { Map, Placemark} from 'react-yandex-maps';
import { Coordinates } from '../App';
import { carColors, CarData, getCarData } from '../mockData';
import { CarOutlined } from '@ant-design/icons'
import {useAppDispatch, useAppSelector} from '../redux/hooks'
import {handleError, setAddress, setCarData, setCurrentCoordinates, setError, setLoading} from '../redux/appSlice'

export interface MapBlockProps {
  form: FormInstance;
  ymapRef: React.MutableRefObject<any>;
}

export const MapBlock = ({ymapRef, form}: MapBlockProps) => {

  const dispatch = useAppDispatch()

  const carData = useAppSelector(state => state.appSliceReducer.carData)
  const currentCoordinates = useAppSelector(state => state.appSliceReducer.currentCoordinates)
  const mapState = useAppSelector(state => state.appSliceReducer.mapState)

  const getPlacemarks = (coordArr: CarData[] | Coordinates[]) => coordArr.map((coord, ind) => {
    if (Array.isArray(coord)) {
      return (<Placemark
        key={ind}
        geometry={coord}
        options={{
          iconColor: 'orange'
        }}
      />)
    }
    return (
      <Placemark
      key={ind}
      geometry={[coord.lat, coord.lon]}
      options={{
        iconColor: ind === 0 ? 'green' : 'greenyellow'
      }}
      />
    )
  })

  const setAddressFromCoordinates = (c: Coordinates) => {
    ymapRef && ymapRef.current?.geocode(c)
      .then((res: any) => {
        const firstResult = res.geoObjects.get?.(0)
        if (firstResult) {
          dispatch(setError(false))
          dispatch(setCurrentCoordinates(c))
          const address = firstResult.getAddressLine?.()
          dispatch(setAddress(address))
          form.setFieldsValue({input: address})
          dispatch(setLoading(true))
          getCarData(c, ymapRef.current)
            .then((data) => dispatch(setCarData(data)))
            .finally(() => dispatch(setLoading(false)))
        } else {
          dispatch(setAddress(''))
          dispatch(handleError())
        }
      })
      .catch((e: Error) => {
        console.error(e)
        dispatch(handleError())
      })
  }

  return (
    <section>
    <div style={{maxWidth: 800, display: 'flex', justifyContent: 'space-between', marginTop: '16px'}}>
        <Map
          modules={['geocode', 'coordSystem.geo']}
          onLoad={(ymap) => ymapRef.current = ymap}
          state={mapState}
          onClick={(e: any) => {
            const coordinates =  e.get('coords')
            setAddressFromCoordinates(coordinates)
          }}>
          {currentCoordinates && getPlacemarks([currentCoordinates])}
          {carData?.length && getPlacemarks(carData)}
        </Map>
      <List
          bordered
          style={{margin: '0 12px'}}
          locale={{emptyText: 'Нет найденных автомобилей'}}
          dataSource={carData ? carData : undefined}
          header={<h2>Доступные автомобили</h2>}
          renderItem={(item) => (
            <List.Item key={item.crew_id}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <div>
                  <CarOutlined style={{color: carColors[item.car_color], marginRight: '8px', fontSize: '20px'}} />
                  {`${item.car_mark} ${item.car_name}`}
                </div>
                <div>Водитель: {item.driver_name}</div>
                <div>Номер телефона: {item.driver_phone}</div>
                <div>Расстояние до автомобиля: {item.distance.toFixed(2)} м</div>
              </div>
            </List.Item>
          )}
        />
    </div>
  </section>
  )
}