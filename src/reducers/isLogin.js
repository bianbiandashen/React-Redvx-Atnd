/**
 * Created by bianbian.
 */
import assign from 'lodash/assign';

const initialState = {};

const isLogin = (state = initialState, action) => {
	if (action.type === 'isLogin') {
		return assign({}, state, {['isLogin']: action.haveLogined});
		// handle request start
	}else if (action.type === 'isLoginOut'){
		return assign({}, state, {['isLogin']: action.haveLogined});

	}
	return state;
};

module.exports = isLogin;
