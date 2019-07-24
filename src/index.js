import '@babel/polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux';
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import {configureStore,persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react';
const store = configureStore();


//打包时，用的HashRouter并加上了basename，因为放在服务器的二级目录下
ReactDOM.render(
  <BrowserRouter>
    <LocaleProvider locale={zh_CN}>
        <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
        <App/>
      </Provider>
            </PersistGate>
    </LocaleProvider>
  </BrowserRouter>,
  document.getElementById('root'));
registerServiceWorker();
