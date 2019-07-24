// /**
//  * Created by bianbian3 on 2019/7/18.
//  */
//
// import thunk from 'redux-thunk';
// import { apiMiddleware, errorMiddleware, genPopulateHttpHeaderMiddleware } from './martian-middleware';
// import { applyMiddleware, compose } from 'redux';
// import devTool from 'remote-redux-devtools';
// import {
// 	AppDebugName, reduxDevToolServer, reduxDevToolPort, realtime,
// } from '../config/devConfig';
// import { genHttpHeader } from './subStore';
// import createSagaMiddleware from 'redux-saga';
// import mySaga from './sagas';
//
// const sageMiddleware = createSagaMiddleware();
// sageMiddleware.run(mySaga);
// module.exports = compose(applyMiddleware(
// 	// errorHandler,
// 	sageMiddleware, // 允许我们 dispatch() 函数
// 	genPopulateHttpHeaderMiddleware(genHttpHeader),
// 	apiMiddleware(true),
// 	errorMiddleware
// 	),
// 	devTool({
// 		hostname: reduxDevToolServer,
// 		port: reduxDevToolPort,
// 		maxAge: 100,
// 		name: AppDebugName,
// 		realtime,
// 	}));
