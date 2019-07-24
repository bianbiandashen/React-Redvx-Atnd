/**
 * Created by bianbian.
 */
import assign from 'lodash/assign';


import {
	extractIsFetching,
} from '../utils/actionType';
const initialState = {};

const isFetching = (state = initialState, action) => {
	if (action.type) {
		// handle request start
		const isFetchingAction = extractIsFetching(action.type);
		if (isFetchingAction) {
			return assign({}, state, isFetchingAction);
		}
	}
	return state;
};

module.exports = isFetching;
