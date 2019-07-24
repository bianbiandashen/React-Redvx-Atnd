/**
 * Created by Administrator on 2017/3/22.
 */
const objectUtils = require('../config/objectUtils');

const { projectName, cachePrefix } = require('../constants/constants');


function saveState(getSavedState = e => e) {
    return (dispatch, getState) => {
        const savedState = JSON.stringify(getSavedState(getState()));
        const { localStorage } = window;
        //let state;
        if (!localStorage) {
            return;
        }

        // 多读少写
        try {
            localStorage.setItem(`${cachePrefix}${projectName}`, savedState);
        }
        catch (err) {
            alert('本地存储无法缓存更多数据，请考虑为本站设置更大的本地存储');
        }
    };
}

module.exports = {
    saveState,
};
