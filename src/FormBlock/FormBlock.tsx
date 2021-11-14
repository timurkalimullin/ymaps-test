import React from 'react'
import { Card, Form, Input, Tag, Spin } from "antd"
import { CarOutlined } from '@ant-design/icons'
import { FormInstance } from "antd/lib/form"
import { carColors, getCarData} from "../mockData"
import debounceFn from 'debounce-fn';
import {useAppDispatch, useAppSelector} from '../redux/hooks'
import { handleError, setCarData, setCurrentCoordinates, setError, setLoading } from '../redux/appSlice'

export interface FormBlockProps {
  ymapRef: any
  form: FormInstance<any>;
}

export const FormBlock = ({ form, ymapRef}: FormBlockProps) => {

  const dispatch = useAppDispatch()

  const address = useAppSelector((state) => state.appSliceReducer.address)
  const carData = useAppSelector((state) => state.appSliceReducer.carData)
  const error = useAppSelector((state) => state.appSliceReducer.error)
  const loading = useAppSelector((state) => state.appSliceReducer.loading)

  const setCoordinatesFromAddress = (a: string) => {
    ymapRef && ymapRef.current?.geocode(a)
      .then((res: any) => {
        const firstResult = res.geoObjects.get?.(0)
        if (firstResult) {
          dispatch(setError(false))
          const coordinates = firstResult.geometry.getCoordinates()
          dispatch(setCurrentCoordinates(coordinates))
          dispatch(setLoading(true))
          getCarData(coordinates, ymapRef.current)
            .then((data) => dispatch(setCarData(data)))
            .finally(() => dispatch(setLoading(false)))
        } else {
          dispatch(handleError())
        }
      })
      .catch((e: Error) => {
        console.error(e)
        dispatch(handleError())
      })
  }
  const debounced = debounceFn((e: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinatesFromAddress(e.target.value)
  }, {wait: 800})

  const validator = () => {
    if (!error) return Promise.resolve()
    return Promise.reject()
  }

  return (
    <section>
    <Form form={form}>
      <Form.Item 
        name="input" 
        required
        rules={[
          {required: true, message: 'Поле не должно быть пустым'},
          {validator, message: 'Поле должно быть заполнено корректно'}
        ]}
        label="Откуда">
        <Input allowClear style={{maxWidth: 350}} onChange={(e) => debounced(e)} value={address} />
      </Form.Item>
    </Form>
    {loading ? <Spin size="large" /> : carData && (
      <Card
        style={{marginTop: '16px', maxWidth: '300px'}}
        size="small"
        title={<h2>Подходящий экипаж</h2>}
      >
        <div>
          <CarOutlined style={{color: carColors[carData[0].car_color], marginRight: '8px', fontSize: '20px'}} />
          {`${carData[0].car_mark} ${carData[0].car_name}`}
          <div>
            <span>Номер автомобиля: </span><Tag>{`${carData[0].car_number}`}</Tag>
          </div>
        </div>
      </Card>
    )}
  </section>
  )
}