// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',
		[ 'ionic', 
			'pickadate',
			'starter.controllers', 
			'starter.services',
			'starter.services.chapterDao', 
			'ngCordova', 
			'ngSanitize', 
			'starter.controllers.chapter',
			'starter.services.commonservice',
			'starter.services.configuration',
			'starter.router'
			])
.constant('AUTH_EVENTS', {
	notAuthenticated : 'auth-not-authenticated', //没有授权
	notAuthorized : 'auth-not-authorized', 	//没有认证
	upadteUserInfo : 'update_user_info', //用户信息更新
	avatarUpdated : 'avatar_updated', //头像更新,
	db_ok : 'dbok',
	libcomplete : 'lib_complete',
	libprogress : 'lib_progress',
	deviceReady : 'deviceready'
})
.constant('USER_ROLES', {
	vip : 'vip',
	superVip : 'superVip',
	user : 'user'
})
.constant('DEVICE_MODEL', {
	iphone51 : 'iPhone5,1',
	iphone52 : 'iPhone5,2',
	iphone53 : 'iPhone5,3',
	iphone54 : 'iPhone5,4',	
	iphone5s1 : 'iPhone6,1', 
	iphone5s2 : 'iPhone6,2',
	iphone6 : 'iPhone7,2',
	iphone6p : 'iPhone7,1',
	iphone6s : 'iPhone8,1',
	iphone6sp : 'iPhone8,2',
	iphonese : 'iPhone8,4'
})
.constant('ENDPOINTS', {
	stat : 'http://www.wsikao.com:8080/stat',
	//登陆地址
	signUpUrl : 'http://www.wsikao.com:8080/user/register',
	//获取认证权限
	authUrl : 'http://www.wsikao.com:8080/user/auth',
	//更新用户
	updateUserUrl : 'http://www.wsikao.com:8080/user/update',
	userInfo : 'http://www.wsikao.com:8080/user/userinfo',
	userId : 'http://www.wsikao.com:8080/user/id',
	xmpp_server : 'http://www.wsikao.com:7070/http-bind/',
	xmpp_domain : 'www.wsikao.com',
	libupdate : 'http://www.wsikao.com:8080/lib/libupdate',
	libresource : 'http://www.wsikao.com:8080/lib/resource',
	appversion : 'http://www.wsikao.com:8080/lib/appversion',
	validatecode : 'http://www.wsikao.com:8080/user/getvalcode',
	checkvalidatecode : 'http://www.wsikao.com:8080/user/checkvalidatecode',
	download : 'http://www.wsikao.com:8080/download/items',
	expressListUrl : 'http://www.wsikao.com:8080/express/list',
	expressIdUrl : 'http://www.wsikao.com:8080/express/id'

	// 	//登陆地址
	// signUpUrl : 'http://localhost:8080/user/register',
	// //获取认证权限
	// authUrl : 'http://localhost:8080/user/auth',
	// //更新用户
	// updateUserUrl : 'http://localhost:8080/user/update',
	// userInfo : 'http://localhost:8080/user/userinfo',
	// userId : 'http://localhost:8080/user/id',
	// xmpp_server : 'http://localhost:7070/http-bind/',
	// xmpp_domain : 'localhost',
	// libupdate : 'http://localhost:8080/lib/libupdate',
	// libresource : 'http://localhost:8080/lib/resource',
	// appversion : 'http://localhost:8080/lib/appversion'

			//登陆地址
	// stat : '/stat',
	// signUpUrl : '/user/register',
	// //获取认证权限
	// authUrl : '/user/auth',
	// //更新用户
	// updateUserUrl : '/user/update',
	// userInfo : '/user/userinfo',
	// userId : '/user/id',
	// xmpp_server : 'http://www.wsikao.com:7070/http-bind/',
	// xmpp_domain : 'www.wsikao.com',
	// libupdate : '/lib/libupdate',
	// libresource : '/lib/resource',
	// appversion : '/lib/appversion',
	// validatecode : '/user/getvalcode',
	// checkvalidatecode : '/user/checkvalidatecode',
	// download : '/download/items',
	// exampaperlist : '/exampaper/list',
	// item : '／WORD%E7%89%882016%E5%8F%B8%E8%80%83%E8%BE%85%E5%AF%BC%E7%94%A8%E4%B9%A61.doc',
	// expressListUrl : '/express/list',
	// expressIdUrl : '/express/id'


})
.constant('CONF', {
	remember_me_key : 'remember-me'
})
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  //避免弹出登陆窗口
  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
})
.config(
	//配置日历组件中文显示
	function(pickadateI18nProvider, $ionicConfigProvider){
		pickadateI18nProvider.translations = {
			prev : '<i class="ion-arrow-left-a"></i> 上月',
			next : '下月 <i class="ion-arrow-right-a"></i>'
		};

		/*必须指定tab位置，否则安卓真机无法显示在底部*/
		$ionicConfigProvider.tabs.position('bottom');

		/*配置实用native scroll*/
		$ionicConfigProvider.scrolling.jsScrolling(true);

		/*使用圆形的，否则会导致不同的平台样式不统一*/
		$ionicConfigProvider.form.checkbox("circle");

	}
)
.run(
	function($ionicPlatform, $rootScope, DB, Confs, AuthService, 
			LibManService, AUTH_EVENTS, $http, $log, $state, $cordovaDevice, 
			StatsLfbService) {
		$rootScope.appVersion = Confs.APP_VERSION
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)

			// navigator.splashscreen.hide();

			if (window.cordova && window.cordova.plugins
					&& window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);

			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}

			//加载数据库，放到dbservice中
			DB.initDB();
			if(angular.isDefined(window.cordova)){
				//app的名字和版本
				cordova.getAppVersion.getVersionNumber(function(version){
					$rootScope.appVersion = version;
				});
				cordova.getAppVersion.getAppName(function(name){
					$rootScope.appName = name;
				});			
			}else{
				$rootScope.appVersion = '0.1';
				$rootScope.appName = '司考2016';
			}

			//保存信息
			// $rootScope.device = $cordovaDevice.getDevice();
			// $rootScope.$broadcast(AUTH_EVENTS.deviceReady);
			// alert(JSON.stringify($rootScope.devcie));

		});

		// AuthService.loadUserCredentials();

		var namePass = AuthService.loadUserNamePassword();
		if(namePass){
			$log.debug('auto login with :' + JSON.stringify(namePass));
			$rootScope.isAuthenticating = true;
			AuthService.login(namePass[0], namePass[1], false);
		}

		//设置默认登陆状态
		// $rootScope.isAuthenticated = false;
		// AuthService.login();

		//监控状态变化，加上验证和授权
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
			$log.debug('state change from state:', JSON.stringify(fromState));	
			$log.debug('state change to state:', JSON.stringify(toState));

			var namePass = AuthService.loadUserNamePassword();
			if(namePass){
				StatsLfbService.track(namePass[0], fromState.name, toState.name, null);
			}
			//需要在router.js中配置权限
			if('data' in toState && 'authorizedRoles' in toState.data ){
				$log.debug('need to authorized');

				if(!AuthService.isAuthenticated()){
					$log.debug('not authenticated, to login state');
					if(toState.name != 'tab.login'){
						$log.debug(toState.name, ' go to tab.login');
						//如果正在验证过程中，退出
						if($rootScope.isAuthenticating){
							return;
						}
						event.preventDefault();
						$state.go('tab.login');
					}
				}else{
					var authorizedRoles = toState.data.authorizedRoles;
					$log.debug(authorizedRoles);
					if(!AuthService.isAuthorized(authorizedRoles)){
						event.preventDefault();
						$log.debug('statechange start:', JSON.stringify($state.current));
						if(!$state.current.abstract){
							$state.go($state.current, {}, {reload:true});
						}
						$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
					}
				}
			}
		});

		//数据库ok了
		// $rootScope.$on(AUTH_EVENTS.db_ok, function(event){
		// 	LibManService.getLibVerLocal();
		// });

		//判断平台
		$rootScope.isAndroid = ionic.Platform.isAndroid();
		// $rootScope.devcie = $cordovaDevice.getDevice();
		// alert($rootScope.devcie);
	}
)
// .filter('outlineFormat', function(){
// 	//格式化大纲内容
// 	return function(content){
// 		content = content.replace(/(第.*?节.*?)\n/gim, "<br /><br /><h5 style=\"text-align:center\">$1</h5>");
// 		return content;
// 	};
// })
.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}])
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = value;
                });
            });

            scope.$on('$ionicView.beforeLeave', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
}).directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
});;
