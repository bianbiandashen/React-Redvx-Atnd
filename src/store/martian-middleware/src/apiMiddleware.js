'use strict';

/*
 import { Schema, arrayOf, normalize } from 'normalizr';
 import { camelizeKeys } from 'humps';
 import {errorCode} from "yr-domains";
 */

const normalizr = require("normalizr");
const {
    Schema, arrayOf, normalize
} = normalizr;
const humps = require("humps");
const {
    camelizeKeys
} = humps;

const errorCode = require('./errorCode');
//import 'isomorphic-fetch'
var Symbol = require('es6-symbol');
const sha1 = require('sha1');
const merge = require("lodash/merge");
const VERSION = '1.3.0';

function fortify(url, init) {
    let url2;
    if(url.indexOf('?') !== -1) {
        url2 = url + `&time=${Date.now()}`;
    } else {
        url2 =  url + `?time=${Date.now()}`;
    }
    merge(init, {
        headers: {
            mnVersion: VERSION,
            mnCode: sha1(`url2/${VERSION}`),
        }
    });

    return url2;
}

function callApi(apiEndPoint, init, schema, fortifyRequest) {
    let apiEndPoint2 = apiEndPoint;

    if (fortifyRequest) {
        apiEndPoint2 = fortify(apiEndPoint, init);
    }
    return fetch(apiEndPoint2, init)
        .then(response =>
            response.json().then(json => ({ json, response })))
        .then(({ json, response }) => {
            if (!response.ok || json.error != undefined) {      // 为了避免运营商劫持，服务器可能以200的code来返回错误
                var error;
                if(json.error != undefined) {
                    error = {
                        httpCode: response.status,
                        // ...json.error
                        code: json.error.code,
                        message: json.error.message
                    }
                }
                else {
                    error = {
                        httpCode: response.status,
                        code: errorCode.errorUndefined.code,
                        message: errorCode.errorUndefined.message
                    }
                }
                return Promise.reject(error)
            }

            const camelizedJson = camelizeKeys(json);

            if(schema) {
                return Promise.resolve(Object.assign({},
                    normalize(camelizedJson, schema)
                ));
            }
            else {
                return Promise.resolve({
                    result: camelizedJson
                });
            }
        })
}



const API_MW_SYMBOL = Symbol('Call_API');
var netAvailable = true;
function setNetAvailable(value) {
    netAvailable = value;
}

let EventTable = {};

function execEvent(type, response, antiType) {
    let callbacks;
    if(EventTable[type] && EventTable[type] instanceof Array && EventTable[type].length > 0) {
        callbacks = EventTable[type];
        delete EventTable[type];
    }
    if(EventTable[antiType]) {
        // 将对应的反回调清空
        delete EventTable[antiType];
    }
    if (callbacks) {
        callbacks.forEach(
            (callback) => {
                callback(response);
            }
        );
    }
}

// A Redux middleware that interprets actions with API_MW_SYMBOL info specified.
// Performs the call and promises when such actions are dispatched.
var apiMiddleware = (fortify) => ({ dispatch, getState }) => next => action => {
    const callAPI = action[API_MW_SYMBOL]

    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let { endpoint } = callAPI
    const { schema, types, init } = callAPI

    if (typeof endpoint === 'function') {
        endpoint = endpoint(getState())
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }
    if (!schema) {
        // throw new Error('Specify one of the exported Schemas.');
    }
    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.')
    }
    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.')
    }

    if(init != null && typeof (init) !== 'object') {
        throw new Error("属性init必须是对象形式");
    }


    function actionWith(data) {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[API_MW_SYMBOL]
        return finalAction
    }

    const [ requestType, successType, failureType ] = types;

    if(!netAvailable) {
        return Promise.reject(next({
            type: failureType,
            error: errorCode.errorNetUnavailable
        }));
    }

    next(actionWith({ type: requestType }));


    return callApi(endpoint, init, schema, fortify).then(
        (response) => {
            let successAction = actionWith({
                response,
                type: successType
            });
            let result = next(successAction);
            execEvent(successType, successAction, failureType);
            return result;
        },
        (err) => {
            const error = (err) ? (
                (err instanceof Error) ? ({                       // 似乎唯一有可能返回Error对象就是因为网络无法连接
                    code: errorCode.errorFailToAccessServer.code,
                    message: errorCode.errorFailToAccessServer.message
                }) : (err)) : ({
                code: errorCode.errorUndefined.code,
                message: errorCode.errorUndefined.message
            });
            const failureAction = actionWith({
                type: failureType,
                error,
            });
            let result = next(failureAction);
            execEvent(failureType, failureAction, successType);
            return Promise.reject(result);
        }
    );
};

function addEvent(type, callback) {
    if(!callback || typeof callback !== 'function') {
        return;
    }
    if (EventTable[type] && EventTable[type] instanceof Array) {
        EventTable[type].push(callback);
        return;
    }
    EventTable[type] = [callback];
}

function removeEvent(type, callback) {
    if(!callback || typeof callback !== 'function') {
        return;
    }
    if(EventTable[type] && EventTable[type] instanceof Array) {
        const idx = EventTable[type].findIndex(callback);
        if(idx !== -1) {
            EventTable[type].splice(idx, 1);
        }
    }
}

module.exports = {
    API_MW_SYMBOL,
    apiMiddleware,
    setNetAvailable,
    addEvent,
    removeEvent,
};
