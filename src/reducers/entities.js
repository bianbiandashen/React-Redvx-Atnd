import values from 'lodash/values';
import setWith from 'lodash/setWith';
import EntityOperations from '../config/entityOperation';
import { CLEAR_LOCAL_DATA } from '../action/actionTypes';

const initialState = {};

const entities = (state = initialState, action) => {

    switch (action.type) {
        case CLEAR_LOCAL_DATA:
            // 如果是登出请求，删掉所有的entities
            return {};
        default:
            break;
    }

    if (action.response && (action.operation || action.response.entities)) {
        const state2 = Object.assign({}, state);
        switch (action.operation) {
            case EntityOperations.GET_ITEM: {
                // 取一行数据，覆盖本行结点
                const _keys = Object.keys(action.response.entities);
                _keys.forEach((list) => {
                    const listValue = action.response.entities[list];
                    const _keys2 = Object.keys(listValue);
                    _keys2.forEach(
                        (item) => {
                            setWith(state2, `${list}.${item}`, action.response.entities[list][item], Object);
                        }
                    );
                });

                return state2;
            }
            case EntityOperations.UPDATE:
            case EntityOperations.GET_ITEM_MERGE: {
                // 更新或者合并一行数据，合并盖本行结点
                const _keys = Object.keys(action.response.entities);
                console.warn("EntityOperations _keys + " + JSON.stringify(_keys));
                _keys.forEach((list) => {
                    const listValue = action.response.entities[list];
                    const _keys2 = Object.keys(listValue);
                    _keys2.forEach(
                        (item) => {
                            // todo 处理update里需要create重渲染的
                            if (state2[list] && !state2[list][item]) {
                                const newList = Object.assign({}, state2[list], {
                                    [item]: listValue[item],
                                });
                                setWith(state2, list, newList);
                            }
                            else {
                                const newItem = Object.assign({}, state2[list] ? state2[list][item] : {}, action.response.entities[list][item]);
                                setWith(state2, `${list}.${item}`, newItem, Object);
                            }
                            // const newItem = Object.assign({}, state2[list] ? state2[list][item] : {}, action.response.entities[list][item]);
                            // setWith(state2, `${list}.${item}`, newItem, Object);
                        }
                    );
                });
                return state2;
            }
            case EntityOperations.CREATE:
            case EntityOperations.APPEND_LIST: {
                // CREATE 和 APPEND_LIST，MERGE然后重载根结点
                // APPEND_LIST  要求对象进行merge，所以assign要发生在对象层次
                const _keys = Object.keys(action.response.entities);
                _keys.forEach((list) => {
                    const listValue = action.response.entities[list];
                    const oldList = Object.assign({}, state2[list]);
                    const _keys2 = Object.keys(listValue);
                    _keys2.forEach(
                        (item) => {
                            const newItem = Object.assign({}, oldList[item], listValue[item]);
                            setWith(oldList, item, newItem, Object);
                        }
                    );
                    setWith(state2, list, oldList, Object);
                });

                return state2;
            }
            case EntityOperations.GET_LIST: {
                // GET_LIST，重载根结点
                const _keys = Object.keys(action.response.entities);
                // 按条件过滤数据 by wkj
                const filterCondition = (list) => {
                    if (state2[list]) {
                        let keyArr = [];
                        if (action.operationCondition) {
                            keyArr = Object.keys(action.operationCondition);
                        }
                        if (keyArr.includes(list)) {
                            Object.keys(state2[list]).forEach(
                                (ele) => {
                                    const i = state2[list][ele];
                                    if (action.operationCondition[list](i)) {
                                        delete state2[list][ele];
                                    }
                                }
                            );
                        }
                        else {
                            state2[list] = {};
                        }
                    }
                };
                if (_keys && Object.keys(_keys).length > 0) {
                    if (action.operationList) {
                        action.operationList.forEach(
                            (list) => {
                                if (!_keys.includes(list)) {
                                    filterCondition(list);
                                }
                            }
                        );
                    }
                    _keys.forEach(
                        (list) => {
                            if (action.operationList) {
                                if (action.operationList.includes(list)) {
                                    filterCondition(list);
                                    const listValue = action.response.entities[list];
                                    const oldList = Object.assign({}, state2[list]);
                                    const _keys2 = Object.keys(listValue);
                                    _keys2.forEach(
                                        (item) => {
                                            const newItem = Object.assign({}, oldList[item], listValue[item]);
                                            setWith(oldList, item, newItem, Object);
                                        }
                                    );
                                    setWith(state2, list, oldList, Object);
                                    // setWith(state2, list, action.response.entities[list], Object);
                                }
                                else {
                                    // 如果该List不在operationList内，则采取类似Append List的策略
                                    const listValue = action.response.entities[list];
                                    const oldList = Object.assign({}, state2[list]);
                                    const _keys2 = Object.keys(listValue);
                                    _keys2.forEach(
                                        (item) => {
                                            const newItem = Object.assign({}, oldList[item], listValue[item]);
                                            setWith(oldList, item, newItem, Object);
                                        }
                                    );
                                    setWith(state2, list, oldList, Object);
                                }
                            }
                            else {
                                setWith(state2, list, action.response.entities[list]);
                            }
                        }
                    );
                }
                else if (action.operationList) {
                    // 过滤掉不属于自己entities
                    values(action.operationList).forEach(
                        (list) => {
                            //state2[list] = {};
                            filterCondition(list);
                        }
                        );
                }

                return state2;
            }
            case EntityOperations.DELETE: {
                // 删除对象结点
                const _keys = Object.keys(action.response.entities);
                if (_keys && _keys.length) {
                    _keys.forEach(
                        (list) => {
                            const deleteThem = () => {
                                const value2 = Object.assign({}, state[list]);
                                const items = action.response.entities[list];
                                Object.keys(items).forEach(
                                    (ele) => {
                                        if (value2.hasOwnProperty(ele)) {
                                            delete value2[ele];
                                        }
                                    }
                                );
                                setWith(state2, list, value2);
                            };
                            if (action.operationList) {
                                if (action.operationList.includes(list)) {
                                    deleteThem();
                                }
                            }
                            else {
                                // 如果没有operationList，则全部删除
                                deleteThem();
                            }
                        }
                    );
                }
                return state2;
            }
            default: {
                return state2;
            }
        }
    }
    return state;
};

module.exports = entities;
