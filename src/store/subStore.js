/**
 * Created by lavystord on 16/8/28.
 */



function mappingToEntities(state) {
    return state.entities;
}

function mappingToIsFetching(state) {
    return state.isFetching;
}

function mappingToSavedState(state) {
  return {
    entities: mappingToEntities(state),
  };
}


module.exports = {
    mappingToEntities,
    mappingToIsFetching,
    mappingToSavedState
};
