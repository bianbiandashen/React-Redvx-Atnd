import { setIsFetching } from '../action/fetch';
import { REQUEST_TAIL, FAILURE_TAIL, SUCCESS_TAIL } from '../utils/actionType';
/*
 *  post请求
 *  url:请求地址
 *  params:参数,这里的参数格式是：{param1: 'value1',param2: 'value2'}
 *  callback:回调函数
 * */
export function post (type, url, actionName, params, navigator) {
	return dispatch => {



		dispatch(setIsFetching(`${actionName}${REQUEST_TAIL}`));

		// params = autoSign(params);

		return fetch(url,{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'multipart/form-data'
			},
			body:params
		})
			.then((response) => {
				if (response && response.status === 200 || response.status === 0 || response.status === 70001 ){
					return response.json()
				}else{

				}


			}).then(responseData => {
				if (responseData && responseData.code === 200 || responseData.code === 0|| responseData.code === 70001){
					dispatch(setIsFetching(`${actionName}${SUCCESS_TAIL}`))
					return Promise.resolve(responseData);

				}

				else {
					if (responseData){
						console.warn('url'+ url);
						console.warn('responseData'+ JSON.stringify(responseData));
						dispatch(setIsFetching(`${actionName}${FAILURE_TAIL}`));
						return Promise.reject(responseData);
					}

				}

			}).catch((error) => {
				dispatch(setIsFetching(`${actionName}${FAILURE_TAIL}`));
				return Promise.reject(error);

			})
	}
}

/*
 *  get请求
 *  url:请求地址
 *  params:参数
 *  callback:回调函数
 * */
export function get(url, actionName, params) {
	if (params) {
		let paramsArray = [];
		//拼接参数
		Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
		if (url.indexOf(/\?/) === -1) {
			url += '?' + paramsArray.join('&')
		} else {
			url += '&' + paramsArray.join('&')
		}
	}
	return dispatch => {
		dispatch(setIsFetching(`${actionName}${REQUEST_TAIL}`))
		console.warn('urlsearchsearch' + url);
		return fetch(url)
			.then(response => response.json()).then(responseData => {
			dispatch(setIsFetching(`${actionName}${SUCCESS_TAIL}`))
				return Promise.resolve(responseData);


			}).catch((error) => {
			dispatch(setIsFetching(`${actionName}${FAILURE_TAIL}`))
				return Promise.reject(error);

		})
	}

}

/*
 *  post请求
 *  url:请求地址
 *  params:参数,这里的参数要用这种格式：'key1=value1&key2=value2'
 *  callback:回调函数
//  * */
// export function postForm(url,params,callback) {
// 	//fetch请求
// 	fetch(url,{
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/x-www-form-urlencoded',
// 		},
// 		body: params
// 	})
// 		.then((response) => response.json())
// 		.then((responseJSON) => {
// 			callback(responseJSON)
// 		})
// 		.catch((error) => {
// 			console.log("error = " + error)
// 		});
// }

/**
 * sign自动排序
 * @author Hman
 * @date 2019/5/21 13:03
 * */
// function autoSign(params) {
// 	console.log(typeof  params,'typeof',params );
// 	if (params &&!params.sign) {
// 		const keys = Object.keys(params);
// 		console.warn(keys.sort());
// 		let sign = "";
// 		keys.map((val)=>{
// 			sign += val + "=" + params.get(val) + '&'
// 		});
// 		sign += 'ba3a25eccc83ecb7fdfcf516129748d1';
// 		console.warn("sign=" + sign);
// 		console.warn("加密后的sign=" + md5.hex_md5(sign));
// 		params.append(md5.hex_md5(sign));
// 	}
// 	return params
// }

