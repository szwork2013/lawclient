angular.module('starter.services')
.factory('ExpressService', function ($http, ENDPOINTS, $log, Common) {

	return {

		loadExpress : function(id){
			$log.debug('express loadOutlink enter');
			var promise = $http.get(Common.buildUrl(ENDPOINTS.expressIdUrl, {id:id}));

			return promise.then(
				function(data){
					var content = '';

					if(data.data){
 						content += '<h4>' + data.data.title + '</h4>';
						content += '<p>' + data.data.content + '</p>';
					}

					return {outline:content};

				}, 
				function(error){
					$log.debug('express load error:', JSON.stringify(error));
					return null;
				}
			);
		},

		loadExpressList : function(from, size){
			$log.debug('express loadOutlink enter');
			return $http.get(Common.buildUrl(ENDPOINTS.expressListUrl, {from:from, size:size}));
		}

	};

});