
function setIsFetching(type) {
	return {
		type
	}
}

function isLogin(type, haveLogined) {
	return {
		type,
		haveLogined,
	}
}


module.exports = {
	setIsFetching,
	isLogin,

}