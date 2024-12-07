module.exports = {
	CLOUD_ID: 'hackweek-8gauui0hb495673b', //你的云环境id   
	COLLECTION_PRFIX: 'bx_',

	IS_DEMO: false, //是否演示版 (后台不可操作提交动作)  
	TEST_MODE: false, // 测试模式 涉及小程序码生成路径， 用以下 TEST_TOKEN_ID openid.. 
	TEST_TOKEN_ID: 'xxx-xxxxx',
	PAY_MCH_ID: '12345678',
	PAY_TEST_MODE: false,
	CLIENT_CHECK_CONTENT: false, //前台图片文字是否校验
	ADMIN_CHECK_CONTENT: false, //后台图片文字是否校验     
	ADMIN_LOGIN_EXPIRE: 86400, //管理员token过期时间 (秒) 
	WORK_LOGIN_EXPIRE: 86400, //服务者token过期时间 (秒) 
}