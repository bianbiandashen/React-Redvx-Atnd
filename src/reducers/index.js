/**
 * Created by bb on 16/9/19.
 */
import pick from 'lodash/pick';
import {combineReducers} from 'redux';
import entities from './entities';
import isFetching from './isFetching';
import isLogin from './isLogin';


const rootReducer = combineReducers({
    isFetching,
    entities,
});

export function getSavedState(state) {
    return { entities: state.entities, isFetching: state.isFetching }
}
export default rootReducer;