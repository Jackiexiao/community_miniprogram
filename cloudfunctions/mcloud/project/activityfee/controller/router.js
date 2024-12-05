/**
 * Notes: 路由配置文件
 * Date: 2024-01-20
 */

module.exports = {
	// =====================================系统
	'test/test': 'test/test_controller@test',
	'job/timer': 'job_controller@minuteJob',
	'home/setup_all': 'home_controller@setupAll',
	'home/setup_get': 'home_controller@getSetup',
	'home/list': 'home_controller@getHomeList',

	// =====================================用户
	'passport/login': 'passport_controller@login',
	'passport/phone': 'passport_controller@getPhone',
	'passport/my_detail': 'passport_controller@getMyDetail',
	'passport/register': 'passport_controller@register',
	'passport/edit_base': 'passport_controller@editBase',
	'passport/user_detail': 'passport_controller@getUserDetail',
	'passport/user_edit': 'passport_controller@editUser',

	// =====================================名片
	'card/list': 'card_controller@getList',
	'card/detail': 'card_controller@getDetail',
	'card/edit': 'card_controller@edit',
	'card/fav': 'card_fav_controller@insertCardFav',
	'card/my_fav_list': 'card_fav_controller@getMyCardFavList',
	'card/del_fav': 'card_fav_controller@delCardFav',
	'card/is_fav': 'card_fav_controller@isFav',

	// =====================================新闻
	'news/list': 'news_controller@getNewsList',
	'news/view': 'news_controller@viewNews',

	// =====================================活动
	'activity/list': 'activity_controller@getActivityList',
	'activity/view': 'activity_controller@viewActivity',
	'activity/detail_for_join': 'activity_controller@detailForActivityJoin',
	'activity/prepay': 'activity_controller@prepay',
	'activity/join_self': 'activity_controller@myJoinSelf',
	'activity/my_join_list': 'activity_controller@getMyActivityJoinList',
	'activity/my_join_detail': 'activity_controller@getMyActivityJoinDetail',
	'activity/my_join_cancel': 'activity_controller@cancelMyActivityJoin',
	'activity/list_by_day': 'activity_controller@getActivityListByDay',
	'activity/has_days': 'activity_controller@getActivityHasDaysFromDay',

	// =====================================管理
	'admin/login': 'admin/admin_mgr_controller@adminLogin',
	'admin/home': 'admin/admin_home_controller@adminHome',
	'admin/clear_vouch': 'admin/admin_home_controller@clearVouchData',

	// 管理员
	'admin/mgr_list': 'admin/admin_mgr_controller@getMgrList',
	'admin/mgr_insert': 'admin/admin_mgr_controller@insertMgr',
	'admin/mgr_del': 'admin/admin_mgr_controller@delMgr',
	'admin/mgr_detail': 'admin/admin_mgr_controller@getMgrDetail',
	'admin/mgr_edit': 'admin/admin_mgr_controller@editMgr',
	'admin/mgr_status': 'admin/admin_mgr_controller@statusMgr',
	'admin/mgr_pwd': 'admin/admin_mgr_controller@pwdMgr',
	'admin/log_list': 'admin/admin_mgr_controller@getLogList',
	'admin/log_clear': 'admin/admin_mgr_controller@clearLog',

	// 系统设置
	'admin/setup_set': 'admin/admin_setup_controller@setSetup',
	'admin/setup_set_content': 'admin/admin_setup_controller@setContentSetup',
	'admin/setup_qr': 'admin/admin_setup_controller@genMiniQr',

	// 用户管理
	'admin/user_list': 'admin/admin_user_controller@getUserList',
	'admin/user_detail': 'admin/admin_user_controller@getUserDetail',
	'admin/user_del': 'admin/admin_user_controller@delUser',
	'admin/user_status': 'admin/admin_user_controller@statusUser',
	'admin/user_data_get': 'admin/admin_user_controller@userDataGet',
	'admin/user_data_export': 'admin/admin_user_controller@userDataExport',
	'admin/user_data_del': 'admin/admin_user_controller@userDataDel',

	// 新闻管理
	'admin/news_list': 'admin/admin_news_controller@getAdminNewsList',
	'admin/news_insert': 'admin/admin_news_controller@insertNews',
	'admin/news_detail': 'admin/admin_news_controller@getNewsDetail',
	'admin/news_edit': 'admin/admin_news_controller@editNews',
	'admin/news_update_forms': 'admin/admin_news_controller@updateNewsForms',
	'admin/news_del': 'admin/admin_news_controller@delNews',
	'admin/news_status': 'admin/admin_news_controller@statusNews',

	// 活动管理
	'admin/activity_list': 'admin/admin_activity_controller@getAdminActivityList',
	'admin/activity_insert': 'admin/admin_activity_controller@insertActivity',
	'admin/activity_detail': 'admin/admin_activity_controller@getActivityDetail',
	'admin/activity_edit': 'admin/admin_activity_controller@editActivity',
	'admin/activity_update_forms': 'admin/admin_activity_controller@updateActivityForms',
	'admin/activity_del': 'admin/admin_activity_controller@delActivity',
	'admin/activity_status': 'admin/admin_activity_controller@statusActivity',
	'admin/activity_join_list': 'admin/admin_activity_controller@getActivityJoinList',
	'admin/activity_join_status': 'admin/admin_activity_controller@statusActivityJoin',
	'admin/activity_join_del': 'admin/admin_activity_controller@delActivityJoin',
	'admin/activity_join_data_get': 'admin/admin_activity_controller@activityJoinDataGet',
	'admin/activity_join_data_export': 'admin/admin_activity_controller@activityJoinDataExport',
	'admin/activity_join_data_del': 'admin/admin_activity_controller@activityJoinDataDel',
	'admin/activity_join_scan': 'admin/admin_activity_controller@scanActivityJoin',
	'admin/activity_join_checkin': 'admin/admin_activity_controller@checkinActivityJoin',
	'admin/activity_self_checkin_qr': 'admin/admin_activity_controller@genActivitySelfCheckinQr',
}
