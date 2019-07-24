/**
 * Created by Hey on 2016/6/20.
 */
// import { persistStore, autoRehydrate } from 'redux-persist';
import {
  createStore, applyMiddleware, compose, combineReducers,
} from 'redux';

import rootReducer from '../reducers/index';
// import createStoreWithMiddleware from './middleware';
import thunk from 'redux-thunk';
import {
    persistStore,
    persistReducer
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiMiddleware, errorMiddleware, genPopulateHttpHeaderMiddleware } from './martian-middleware';
import devTool from 'remote-redux-devtools';
import {
    AppDebugName, reduxDevToolServer, reduxDevToolPort, realtime,
} from '../config/devConfig';
import { genHttpHeader } from './subStore';
import createSagaMiddleware from 'redux-saga';
import mySaga from './sagas';

const sageMiddleware = createSagaMiddleware();
const persistConfig = {
    key: 'root',
    storage,
}

let store;
const { projectName, cachePrefix } = require('../constants/constants');

function configureStore() {
  const localStorage = window.localStorage;
  let state;
  if (!localStorage) {
      alert('浏览器不支持本地存储!');
  }
  else {
      state = localStorage.getItem(`${cachePrefix}${projectName}`);
      if (state) {
          try {
              state = JSON.parse(state);
          }
          catch (err) {
              console.error('本地缓存的数据不能序列化');
              state = undefined;
          }
      }
  }

  let initialState;
  if (state) {
      initialState = state;
      // console.log(`Recovered selection from disk:${JSON.stringify(state)}`);
  }
  else {
      console.log('Initialized with no selection on disk.');
  }
    const persistedReducer = persistReducer(persistConfig, rootReducer);

  store = createStore(persistedReducer, initialState,
      compose(applyMiddleware(
          // errorHandler,
          thunk, // 允许我们 dispatch() 函数
          genPopulateHttpHeaderMiddleware(genHttpHeader),
          apiMiddleware(true),
          errorMiddleware
          ),
          devTool({
              hostname: reduxDevToolServer,
              port: reduxDevToolPort,
              maxAge: 100,
              name: AppDebugName,
              realtime,
          }))
  );
    // sageMiddleware.run(mySaga);


  return store;
}
const persistor = persistStore(configureStore());

module.exports = {
  configureStore,
    persistor,
};