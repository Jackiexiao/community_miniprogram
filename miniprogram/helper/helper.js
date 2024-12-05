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


 function formatNumber(n) {
 	n = n.toString()
 	return n[1] ? n : '0' + n
 }
 function getOptionsIdx(options, val) {
 	for (let i = 0; i < options.length; i++) {
 		if (options[i].value === val)
 			return i;
 	}
 	return 0;
 }
  
 

 module.exports = {
 	isDefined,
 	isObjectNull,  
 	sleep,
     

 	getOptionsIdx,    
 
 }