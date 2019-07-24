import CRUD from '../config/entityOperation';
import { makeRequestAction }  from './requestAction';
import Entities from '../constants/entities';
import { get, post } from '../action/request';
import { isLogin } from '../action/fetch';

import { debugServerUrl, releaseServerUrl }  from '../config/config';
import {isAuthenticated,authenticateSuccess,logout} from '../utils/Session'



export function getUserInfo() {
	return dispatch => {
		return new Promise(function(resolve, reject) {

				let formData1 = new FormData();
				//暂时写死accsetoken
				// dispatch(post('POST',`${releaseServerUrl}/api/v1/auth/user/get_user_info`,'getUserInfo',formData1)).then(responseData => {
				// 	resolve(responseData.object)
				// 	dispatch(AddUser(responseData.object));
				//
				//
				// }).catch((error) => {
				// 	console.warn(JSON.stringify(error));
				//
				// })
			})
	}
}

export function AddUserInfo() {
	return dispatch => {
		return new Promise(function(resolve, reject) {

			let formData1 = new FormData();
			dispatch(AddUser({id: 1, username: 'bianbian', password: 'admin'}))
			//暂时写死accsetoken
			// dispatch(post('POST',`${releaseServerUrl}/api/v1/auth/user/get_user_info`,'getUserInfo',formData1)).then(responseData => {
			// 	resolve(responseData.object)
			// 	dispatch(AddUser(responseData.object));
			//
			//
			// }).catch((error) => {
			// 	console.warn(JSON.stringify(error));
			//
			// })
		})
	}

}

export function Login(flag) {
	// this.loginUser = info  //设置登录用户信息
	return dispatch => {
		return new Promise(function(resolve, reject) {

			let formData1 = new FormData();
			dispatch(AddToken({id: 1, username: 'bianbian', password: 'admin'}))
			//暂时写死accsetoken
			// dispatch(post('POST',`${releaseServerUrl}/api/v1/auth/user/get_user_info`,'getUserInfo',formData1)).then(responseData => {
			// 	resolve(responseData.object)
			// 	dispatch(AddUser(responseData.object));
			//
			//
			// }).catch((error) => {
			// 	console.warn(JSON.stringify(error));
			//
			// })
		})
	}

}

export function LoginOut(flag) {
	// this.loginUser = info  //设置登录用户信息
	return dispatch => {
		return new Promise(function(resolve, reject) {

			let formData1 = new FormData();
			dispatch(ClearToken({id: 1, username: 'bianbian', password: 'admin'}))
			//暂时写死accsetoken
			// dispatch(post('POST',`${releaseServerUrl}/api/v1/auth/user/get_user_info`,'getUserInfo',formData1)).then(responseData => {
			// 	resolve(responseData.object)
			// 	dispatch(AddUser(responseData.object));
			//
			//
			// }).catch((error) => {
			// 	console.warn(JSON.stringify(error));
			//
			// })
		})
	}

}


function makeAction(entity) {
	if (entity) {
		const {
			name,
			operation,
			data,
		} = entity;
		// const  isLoading = true;
		return makeRequestAction(name, operation, data);
	}
}


function AddUser(obj) {


	const entity = {
		name: Entities.user,
		operation: CRUD.CREATE,
		data: obj,
	};
	const action = makeAction(entity);
	return action;
}


function AddToken(obj) {


	const entity = {
		name: Entities.token,
		operation: CRUD.CREATE,
		data: obj,
	};
	const action = makeAction(entity);
	return action;
}


function ClearToken(obj) {


	const entity = {
		name: Entities.token,
		operation: CRUD.DELETE,
		data: obj,
	};
	const action = makeAction(entity);
	return action;
}