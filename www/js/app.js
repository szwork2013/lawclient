// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',
		[ 'ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(
		function($ionicPlatform, $cordovaSQLite, $rootScope, DB) {
			$ionicPlatform.ready(function() {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				if (window.cordova && window.cordova.plugins
						&& window.cordova.plugins.Keyboard) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
					cordova.plugins.Keyboard.disableScroll(true);

				}
				if (window.StatusBar) {
					// org.apache.cordova.statusbar required
					StatusBar.styleDefault();
				}

				var db = null;
				console.log($rootScope); 
				//加载数据库
				if(window.sqlitePlugin){
					window.plugins.sqlDB.copy("law.db", function() {
            		db = $cordovaSQLite.openDB("law.db");
        			}, function(error) {
            		console.error("There was an error copying the database: " + error);        		
            		});
				}else{
					//in browser
					DB.initDB();
				}
			});
		})

.config(function($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// .state('app', {
	//     url: '/app',
	//     abstract:true,
	//     templateUrl:'templates/menu.html',
	//     controller : 'AppCtrl'
	//   }
	// )

	// setup an abstract state for the tabs directive
	.state('tab', {
		url : '/tab',
		abstract : true,
		templateUrl : 'templates/menu.html',
		controller : 'TabCtrl'
	})

	.state('tab.menu', {
		url : '/menu',
		abstract : true,
		views : {
			'menuContent' : {
				templateUrl : 'templates/tabs.html'
			}
		}
	})

	// Each tab has its own nav history stack:

	.state('tab.menu.dash', {
		url : '/dash',
		views : {
			'tab-dash' : {
				templateUrl : 'templates/tab-dash.html',
				controller : 'DashCtrl'
			}
		}
	})
	.state('tab.menu.chats', {
		url : '/chats',
		views : {
			'tab-chats' : {
				templateUrl : 'templates/tab-chats.html',
				controller : 'ChatsCtrl'
			}
		}
	}).state('tab.menu.detail', {
		url : '/detail/:chatId',
		views : {
			'tab-chats' : {
				templateUrl : 'templates/chat-detail.html',
				controller : 'ChatDetailCtrl'
			}
		}
	}).state('tab.menu.mine', {
		url : '/mine',
		views : {
			'tab-mine' : {
				templateUrl : 'templates/tab-mine.html',
				controller : 'MineCtrl',
			}
		},
		resolve : {
			lawList : function(LawService) {
				return LawService.fetchDefaultList();
			}
		}
	})

	.state('tab.menu.account', {
		url : '/account',
		views : {
			'tab-account' : {
				templateUrl : 'templates/tab-account.html',
				controller : 'AccountCtrl'
			}
		}
	}).state('tab.menu.lawdetail', {
		url : '/lawdetail/:lawid',
		views : {
			'tab-mine' : {
				templateUrl : 'templates/law-detail.html',
				controller : 'LawDetailCtrl',
				resolve : {
					law : function($stateParams, LawService) {
						return LawService.fetchDetail($stateParams.lawid);
					}
				}
			}
		}
	}).state('tab.menu.practice', {
		url : '/practice',
		abstract : true,
		views : {
			'tab-dash' : {
				templateUrl : 'templates/practice.html',
				controller : 'PracticeCtrl'				
			}
		}
	}).state('tab.menu.practice.chapter', {
		url : '/chapter',
		views : {
			'chapter' : {
				templateUrl : 'templates/practice-chapter.html',
				controller : 'ChapterCtrl'
			}
		}
	}).state('tab.menu.practice.exam', {
		url : '/exam/:qid',
		views : {
			'chapter' : {
				templateUrl : 'templates/chapter-exam.html',
				controller : 'ExamCtrl'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/menu/dash');

}).directive('hideTabs', function($rootScope) {
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
});