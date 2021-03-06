angular.module('starter.services')
.factory('UserService', function($http, $log, $q, $rootScope, $cacheFactory, ENDPOINTS, Common, AUTH_EVENTS){

	var user = {};

	var userDetail = {};

	var cache = $cacheFactory('UserServiceCache');

	/**
	更新用户信息，可以部分更新，或者同时更新多个内容
	*/
	var updateUser = function(user){
		$http.get(Common.buildUrl(ENDPOINTS.updateUserUrl, user)).success(function(data){
			$log.debug(data);
		}).error(function(error){
			$log.error(error);
		});
	};

	/**
	获取用户信息，通过用户名称
	*/
	function getUserInfoByUsername(username, broadcast){

		var deffered = $q.defer();

		var tmpUser = cache.get(username);

		if(tmpUser){
			//如果从缓存中找到
			$log.debug('user from cache:', tmpUser);
			if(broadcast){
				user = tmpUser;
				$rootScope.$broadcast(AUTH_EVENTS.updateUserInfo, user);
			}
			deffered.resolve(tmpUser);
			return deffered.promise;
		}else{
			$http.get(Common.buildUrl(ENDPOINTS.userInfo, {username:username})).success(function(data){
				if(data){
					//加入缓存
					cache.put(username, data);
					if(broadcast){
						user = data;
						//广播出去，更新需要用户信息的地方，需要使用rootscope向下传播
						$log.debug('update user info broadcasted.');
						$rootScope.$broadcast(AUTH_EVENTS.updateUserInfo, user);
					}
				}
				deffered.resolve(data);
			}).error(function(error){
				deffered.reject(error);
			});
			return deffered.promise;
		}
	}

	/**
	获取用户信息，通过用户名称
	*/
	function getUserInfoByUserId(userId){
		var deffered = $q.defer();
		$http.get(Common.buildUrl(ENDPOINTS.userId, {userId:userId})).success(function(data){
			if(data){
				user = data;
			}
			deffered.resolve(data);
		}).error(function(error){
			deffered.reject(error);
		});
		return deffered.promise;
	}	

	return {
		getUserInfoByUsername : getUserInfoByUsername,
		updateUser : updateUser,
		user : function(){return user;},
		userDetail : userDetail
	};
});