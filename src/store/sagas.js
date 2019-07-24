/**
 * Created by bianbian3 on 2019/7/21.
 */

import { call, put, takeEvery} from 'redux-saga/effects';


const  api = {


	login(){
		return new Promise((reslove, reject)=>{
			setTimeout(()=>{
				if(Math.random()>0.5){
					reslove({id: 1, name:'biabian'})
				}
				else{
					reject('用户名密码错误')
				}
			},1000)
		})
	}
}

//work saga
function* login(action) {
	const  result = yield  call(api.login,{});


	console.log('biabianloginSuccsee'+ JSON.stringify(result))
	yield  put({ type: 'login',result })


}
//监听器
function * mySaga() {
	yield takeEvery[('login_request',login)]

}


export default mySaga;