/**
 * Notes: 路由配置文件
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-10-20 07:48:00 
 */

module.exports = {
	'home/setup_all': 'home_controller@setupAll',

	'passport/phone': 'passport_controller@getPhone',
	'passport/my_detail': 'passport_controller@getMyDetail',
	'passport/edit_base': 'passport_controller@editBase',

	// 名片相关
	'card/list': 'card_controller@getCardList',
	'card/my_list': 'card_controller@getMyCardList',
	'card/my_detail': 'card_controller@getMyCardDetail',
	'card/detail': 'card_controller@getCardDetail',
	'card/insert': 'card_controller@insertCard',
	'card/edit': 'card_controller@editCard',
	'card/del': 'card_controller@delCard',
	'card/update_pic': 'card_controller@updateCardPic',

	// 名片收藏相关
	'card/fav_insert': 'card_fav_controller@insertCardFav',
	'card/fav_del': 'card_fav_controller@delCardFav',
	'card/my_fav_list': 'card_fav_controller@getMyCardFavList',

	// 活动相关
	'activity/list': 'activity_controller@getActivityList',
	'activity/my_list': 'activity_controller@getMyActivityList',
	'activity/my_detail': 'activity_controller@getMyActivityDetail',
	'activity/detail': 'activity_controller@getActivityDetail',
	'activity/insert': 'activity_controller@insertActivity',
	'activity/edit': 'activity_controller@editActivity',
	'activity/del': 'activity_controller@delActivity',
	'activity/update_pic': 'activity_controller@updateActivityPic',
	'activity/join': 'activity_controller@joinActivity',
	'activity/cancel': 'activity_controller@cancelActivity',
	'activity/join_list': 'activity_controller@getActivityJoinList',

	// 管理员相关
	'admin/home': 'admin/admin_home_controller@adminHome',
	'admin/clear_cache': 'admin/admin_home_controller@clearCache',

	'admin/login': 'admin/admin_mgr_controller@adminLogin',
	'admin/mgr_list': 'admin/admin_mgr_controller@getMgrList',
	'admin/mgr_insert': 'admin/admin_mgr_controller@insertMgr',
	'admin/mgr_del': 'admin/admin_mgr_controller@delMgr',
	'admin/mgr_detail': 'admin/admin_mgr_controller@getMgrDetail',
	'admin/mgr_edit': 'admin/admin_mgr_controller@editMgr',
	'admin/mgr_status': 'admin/admin_mgr_controller@statusMgr',
	'admin/mgr_pwd': 'admin/admin_mgr_controller@pwdMgr',
	'admin/log_list': 'admin/admin_mgr_controller@getLogList',
	'admin/log_clear': 'admin/admin_mgr_controller@clearLog',

	'admin/user_list': 'admin/admin_user_controller@getUserList',
	'admin/user_detail': 'admin/admin_user_controller@getUserDetail',
	'admin/user_del': 'admin/admin_user_controller@delUser',
	'admin/user_status': 'admin/admin_user_controller@statusUser',

	'admin/activity_list': 'admin/admin_activity_controller@getActivityList',
	'admin/activity_insert': 'admin/admin_activity_controller@insertActivity',
	'admin/activity_detail': 'admin/admin_activity_controller@getActivityDetail',
	'admin/activity_edit': 'admin/admin_activity_controller@editActivity',
	'admin/activity_update_forms': 'admin/admin_activity_controller@updateActivityForms',
	'admin/activity_del': 'admin/admin_activity_controller@delActivity',
	'admin/activity_sort': 'admin/admin_activity_controller@sortActivity',
	'admin/activity_status': 'admin/admin_activity_controller@statusActivity',
	'admin/activity_join_list': 'admin/admin_activity_controller@getActivityJoinList',
	'admin/activity_join_del': 'admin/admin_activity_controller@delActivityJoin',
	'admin/activity_join_status': 'admin/admin_activity_controller@statusActivityJoin',
	'admin/activity_join_data_get': 'admin/admin_activity_controller@activityJoinDataGet',
	'admin/activity_join_data_export': 'admin/admin_activity_controller@activityJoinDataExport',
	'admin/activity_join_data_del': 'admin/admin_activity_controller@activityJoinDataDel',

	'admin/news_list': 'admin/admin_news_controller@getNewsList',
	'admin/news_insert': 'admin/admin_news_controller@insertNews',
	'admin/news_detail': 'admin/admin_news_controller@getNewsDetail',
	'admin/news_edit': 'admin/admin_news_controller@editNews',
	'admin/news_update_forms': 'admin/admin_news_controller@updateNewsForms',
	'admin/news_del': 'admin/admin_news_controller@delNews',
	'admin/news_sort': 'admin/admin_news_controller@sortNews',
	'admin/news_status': 'admin/admin_news_controller@statusNews',
}
