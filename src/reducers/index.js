/**
 * Created by bb on 16/9/19.
 */
import {combineReducers} from 'redux';
import entities from './entities';
import isFetching from './isFetching';
import isLogin from './isLogin';


const rootReducer = combineReducers({
    isFetching,
    isLogin,
    entities,
});

export default rootReducer;