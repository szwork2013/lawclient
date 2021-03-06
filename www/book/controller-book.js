/**
*  Module
*
* Description
*/
angular.module('starter.controllers')
.controller('BookCtrl', function($scope, $controller, $log){
	$log.debug('book ctrl enter');
	$controller('ChapterCtrl', {$scope : $scope});
	$scope.entryType = 4;
})
.controller('BookEntryCtrl', function($scope, $log, $stateParams, $ionicActionSheet, $ionicScrollDelegate, $ionicPopover, BookService, OutlineService, Common){
	/*
	书籍
	*/

	$scope.$on('$ionicView.beforeEnter', function(event){
		var fontSize = window.localStorage.getItem('book-font-size');
		if(fontSize){
			$scope.fontSize = fontSize - '0';
		}
		var bgImage = window.localStorage.getItem('book-background-image');
		if(bgImage){
			$scope.background = bgImage;
		}else{
			$scope.background = "img/bg/b25.png";
		}
	});

	$scope.chapterName = $stateParams.chapterName;

	$scope.segContent = '';
	$scope.chapter = [];

	$scope.segmentShow = false;
	$scope.currentSeg = 0;

	$scope.fontSize = 1.25;

	$log.debug('book entry ctrl enter');
	var promise = BookService.loadBook($stateParams.chapterid);
	promise.then(
		function(data){
			$log.debug('load book ok:', JSON.stringify(data))
			if(data){
				for(var idx in data){
					$scope.chapter[data[idx].seg_id - 1] = {id:data[idx].seg_id, title:data[idx].seg_title,content:data[idx].seg_content};
				}
				fillBookContent();
			}
		}, 
		function(error){
			$log.debug('load book error:', JSON.stringify(error))
		}
	);

	promise = OutlineService.loadOutline($stateParams.chapterid);
	promise.then(
		function(data){
			if(data){
				$scope.outline = data.outline;
				fillBookContent();
			}
		}, 
		function(error){
			$log.debug(JSON.stringify(error));
		}
	);

	function fillBookContent(){
		if($scope.currentSeg > 0){
			$scope.segContent = '<h4>第' + Common.number2Chinese(($scope.currentSeg)) + '节 ' +  $scope.chapter[$scope.currentSeg-1].title + '</h4>';
			$scope.segContent += $scope.chapter[$scope.currentSeg - 1].content;
		}else{
			$scope.segContent = $scope.outline;
		}
		$ionicScrollDelegate.scrollTop();
	}

	// $scope.chooseSeg = function(segId){
	// 	$log.debug('choose seg clicked');
	// 	$scope.currentSeg = segId - 1;
	// 	fillBookContent();
	// };

	//往前
	$scope.prev = function(){
		if($scope.currentSeg > 0){
			$scope.currentSeg -= 1;
			fillBookContent();
		} 
	};

	//往后
	$scope.next = function(){
		if($scope.currentSeg < $scope.chapter.length ){
			$scope.currentSeg += 1;
			fillBookContent();
		}
	};

	$scope.showSegments = function(){

		var buttonDesc = [{text: $scope.currentSeg == 0 ? '<b>大纲</b>' : '大纲'}];
		for(var idx in $scope.chapter){
			var t = $scope.chapter[idx].id + '. ' + $scope.chapter[idx].title;
			if(idx == $scope.currentSeg - 1){
				t = '<b>' + t + '</b>';
			}
			buttonDesc.push({text:t});
		}
		var segments = $ionicActionSheet.show({
			buttons : buttonDesc,
			buttonClicked : function(idx){
				$scope.currentSeg = idx;
				fillBookContent();
				return true;
			}
		});
	};

	$scope.increaseFontSize = function(){
		if($scope.fontSize < 3){
			$scope.fontSize += 0.25;
		}
		window.localStorage.setItem('book-font-size', $scope.fontSize);
	}

	$scope.reduceFontSize = function(){
		if($scope.fontSize > 1){
			$scope.fontSize -= 0.25;
		}
		window.localStorage.setItem('book-font-size', $scope.fontSize);		
	}

	$scope.setBackground = function(bgImage){
		$log.debug("set background:" + bgImage);
		$scope.background = bgImage;
		window.localStorage.setItem('book-background-image', bgImage);
	};

	$scope.bgImageArr = ["img/bg/mz.png", "img/bg/paper-6.png", "img/bg/paper-11.png", "img/bg/b25.png"];

	$ionicPopover.fromTemplateUrl('outline/popover.html', {scope : $scope}).then(
		function(popover){
			$log.debug("create popover");
			$scope.popover = popover;
		}
	);

	$scope.openPopover = function($event){
		$scope.popover.show($event);
	};
});