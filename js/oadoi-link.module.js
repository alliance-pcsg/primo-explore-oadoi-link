angular
  .module('oadoi', [])
  .component('prmFullViewServiceContainerAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope, $http, $element, oadoiService, oadoiOptions) {
        this.$onInit = function() {
        	$scope.oaDisplay=false; /* default hides template */
          $scope.imagePath=oadoiOptions.imagePath;
          var email=oadoiOptions.email;
        	var section=$scope.$parent.$ctrl.service.scrollId;
        	var obj=$scope.$ctrl.parentCtrl.item.pnx.addata;
          var debug=oadoiOptions.debug;

        	if (obj.hasOwnProperty("doi")){
        		var doi=obj.doi[0];
						if(debug){ console.log("doi:"+doi); }

    				if (doi && section=="getit_link1_0"){
    					var url="https://api.oadoi.org/v2/"+doi+"?email="+email;

              var response=oadoiService.getOaiData(url).then(function(response){
                if(debug){
                  console.log("response from oadoiService received:");
                  console.log(response);
                }
                var oalink=response.data.best_oa_location.url;
                if(oalink===null){
                  $scope.oaDisplay=false;
                  if(debug){ console.log("oaDisplay set to false (no link returned)"); }
                  $scope.oaClass="ng-hide";
                }
                else{
                  if(debug){ console.log("oalink from response: " + oalink); }
                  $scope.oalink=oalink;
                  $scope.oaDisplay=true;
                  $element.children().removeClass("ng-hide"); /* initially set by $scope.oaDisplay=false */
                  $scope.oaClass="ng-show";
                }

              });
    				}
    				else{$scope.oaDisplay=false;
    				}
        	}
        	else{
        		$scope.oaClass="ng-hide";
        	}
        };

    },
  template: '<div style="height:50px;background-color:white;padding:15px;" ng-show="{{oaDisplay}}" class="{{oaClass}}"><img src="{{imagePath}}" style="float:left;height:22px;width:22px;margin-right:10px"><p >Full text available via: <a href="{{oalink}}" target="_blank" style="font-weight:600;font-size:15px;color;#2c85d4;">Open Access</a></p></div>'
}).factory('oadoiService', ['$http',function($http){
  return{
    getOaiData: function (url) {
      return $http({
        method: 'GET',
        url: url,
        cache: true
      })
    }
  }
}]).run(
  ($http) => {
    // Necessary for requests to succeed...not sure why
    $http.defaults.headers.common = { 'X-From-ExL-API-Gateway': undefined }
  },
);
