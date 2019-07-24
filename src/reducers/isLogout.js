/**
 * Created by bianbian.
 */
import assign from 'lodash/assign';

const initialState = {};

const isLogout = (state = initialState, action) => {
	console.warn('action'+JSON.stringify(action))
	if (action.type) {
		return assign({}, state, {['isLogin']: false});
		// handle request start
	}
	return state;
};

module.exports = isLogout;
