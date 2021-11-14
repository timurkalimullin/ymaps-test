import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css'
import { YMaps } from 'react-yandex-maps';
import { Provider } from 'react-redux';
import { store } from './redux/store'

const API_KEY =  // вставьте свой ключ для АПИ Яндекс карт

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <YMaps query={{apikey: API_KEY}}>
        <App/>
      </YMaps>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
