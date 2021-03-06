angular.module('starter.router')
.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('tab.menu.chats', {
		url : '/chats',
		abstract : true,
		views : {
			'tab-chats' : {
				templateUrl : 'tab/tab-chats.html',
				controller : 'MessageCtrl'
			}
		}
		//需要权限?
		,data : {
			authorizedRoles : ["user", "vip"]
		}
	}).state('tab.menu.detail', {
		url : '/detail/:chatId',
		views : {
			'tab-chats' : {
				templateUrl : 'social/chat-detail.html',
				controller : 'ChatDetailCtrl'
			}
		}
	}).state('tab.menu.chats.messages', {
		url : '/messages',
		views : {
			'chats-content' : {
				templateUrl : 'social/messages.html',
				controller : 'MessageCtrl'
			}
		}
	}).state('tab.menu.chats.roster', {
		url : '/roster',
		views : {
			'chats-content' : {
				templateUrl : 'social/roster.html',
				controller : 'RosterCtrl'
			}
		}
	}).state('tab.menu.chats.rooms', {
		url : '/rooms',
		views : {
			'chats-content' : {
				templateUrl : 'social/rooms.html',
				controller : 'RoomsCtrl'
			}
		}
	}).state('tab.menu.chatroom', {
		url : '/chatroom?room',
		views : {
			'tab-chats' : {
				templateUrl : 'social/chat-detail.html',
				controller : 'ChatRoomCtrl'
			}
		}
	}).state('tab.friends', {
		url : '/friends',
		views : {
			'menuContent' : {
				templateUrl : 'social/friends-search.html',
				controller : 'FriendsSearchCtrl'
			}
		}
	}).state('tab.roomInfo', {
		url : 'roominfo',
		views : {
			'menuContent' : {
				templateUrl : 'social/room-info.html',
				controller : 'RoomInfoCtrl'
			}
		}
	});
});