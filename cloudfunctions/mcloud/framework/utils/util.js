function getProjectId() {
	if (global.PID)
		return global.PID;
	else
		return 'ONE';
}
function isDefined(val) {
	if (val === undefined)
		return false;
	else
		return true;
}
function isObjectNull(obj) {
	return (Object.keys(obj).length == 0);
}
function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
};




module.exports = {
	getProjectId,
	isDefined, //判断变量，参数，对象属性是否定义  
	sleep,
	isObjectNull,

}