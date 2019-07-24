/**
 * Created by Administrator on 2018/6/25.
 */
import { getSchemas } from '../constants/schemas';
import { camelizeKeys } from 'humps';
import { normalize, schema } from 'normalizr';

function makeRequestAction(entity, operation, data) {
    const Schemas = getSchemas();
    let Schema;
    if (Schemas.hasOwnProperty(entity)) {
        Schema = Schemas[entity];
    }

    if (!Schema) {
        return;
    }
    if (data instanceof Array) {
        Schema = new schema.Array(Schema)
    }

    const camelizedJson = camelizeKeys(data);
    const response = normalize(camelizedJson, Schema);
    console.warn("Hman-response=" + JSON.stringify(response));
    return {
        type: `${entity}_DUMMY_REQUEST`,
        response,
        operation,
    };
}

module.exports = {
    makeRequestAction,
};
