/**
 * Created by Administrator on 2018/8/3.
 */
import Entities  from './entities.js';
import set from 'lodash/set';
const { schema } = require('normalizr');


let S;

function initSchema() {
    S = {};
    const ID_ATTRIBUTE = {
        [Entities.user]: { idAttribute: 'id' },

    };
    Object.keys(Entities).forEach(
        (ele) => {
            set(S, Entities[ele], new schema.Entity(Entities[ele], {}, ID_ATTRIBUTE[Entities[ele]]));
        }
    );
    // S[Entities.room].define({
    //     devices: new schema.Array(S[Entities.devices]),
    // });
    // S[Entities.house].define({
    //     gatewayList: new schema.Array(S[Entities.gateway]),
    // }); //不解构house的gatewayList数据

}

function getSchemas() {
    if (!S) {
        initSchema();
    }

    return S;
}

module.exports = {
    getSchemas,
};
