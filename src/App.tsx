import React, { useEffect, useRef } from 'react';
import { Button, Divider, Form, message } from 'antd'
import { FormBlock } from './FormBlock/FormBlock';
import { MapBlock } from './MapBlock/MapBlock'
import './App.css';
import { makeMockRequestData } from './mockData/';
import {useAppSelector} from './redux/hooks'

export type Coordinates = [number, number]

function App() {

  const error = useAppSelector((state) => state.appSliceReducer.error)
  const carData = useAppSelector((state) => state.appSliceReducer.carData)
  const address = useAppSelector((state) => state.appSliceReducer.address)

  const ymapRef = useRef<any>(null)

  const [form] = Form.useForm()

  useEffect(() => {
    form.validateFields()
  }, [error, form])

  //#region handlers

  const onSubmit = () => {
    form.submit()
    const messageContent = carData && JSON.stringify(makeMockRequestData(carData[0], address))
    message.success({duration: 10, content: messageContent})
  }

  //#endregion handlers

  return (
    <div className="App">
      <div style={{maxWidth: '800px', margin: '0 auto', padding: '16px'}}>
        <h2>Детали заказа</h2>
        <Divider />
        <FormBlock
          ymapRef={ymapRef}
          form={form}
        />
        <Divider />
        <MapBlock
          ymapRef={ymapRef}
          form={form}
        />
        <Button type="primary" style={{marginTop: '16px'}} disabled={error} onClick={onSubmit}>Заказать</Button>
      </div>
    </div>
  );
}

export default App;
