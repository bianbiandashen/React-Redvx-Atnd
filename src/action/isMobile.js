/**
 * Created by Administrator on 2017/3/27.
 */

// 检查是否为手机环境
function isMobile(){
    return /*/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(navigator.userAgent)? true: false ||*/ window.innerWidth < 1000;
}

module.exports = isMobile;
