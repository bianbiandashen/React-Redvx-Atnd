/**
 * coded by xc, 2016-10-17
 * @type {ok}
 */
// const assert = require('assert');
import assert from 'assert';
const REQUEST_TAIL = '_REQUEST';
const SUCCESS_TAIL = '_SUCCESS';
const FAILURE_TAIL = '_FAILURE';
const DUMMY_REQUEST = 'DUMMY_REQ';

function makeActionType(actionFn, tags) {
    assert(typeof actionFn === 'function');
    if (actionFn.apiId && typeof actionFn.apiId === 'function') {
        const apiId = actionFn.apiId();
        assert(typeof apiId === 'number');
        const method = actionFn.method ? actionFn.method.concat('-').concat(apiId.toString()) : apiId.toString();
        return tags ? method.concat(tags.toString()) : method;
    }
    return tags ? actionFn.name.concat(tags.toString()) : actionFn.name;
}

function extractIsFetching(actionType) {
    const indexRequest = actionType.lastIndexOf(REQUEST_TAIL);
    if (indexRequest !== -1) {
        const type = actionType.substring(0, indexRequest);
        return {
            [type]: true,
        };
    }

    const indexSuccess = actionType.lastIndexOf(SUCCESS_TAIL);
    if (indexSuccess !== -1) {
        const type = actionType.substring(0, indexSuccess);
        return {
            [type]: false,
        };
    }

    const indexFailure = actionType.lastIndexOf(FAILURE_TAIL);
    if (indexFailure !== -1) {
        const type = actionType.substring(0, indexFailure);
        return {
            [type]: false,
        };
    }
    return undefined;
}

module.exports = {
    makeActionType,
    extractIsFetching,
    REQUEST_TAIL,
    SUCCESS_TAIL,
    FAILURE_TAIL,
    DUMMY_REQUEST,
};
