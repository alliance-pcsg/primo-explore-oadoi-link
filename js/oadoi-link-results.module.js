angular
  .module('oadoiResults', [])
  .component('prmSearchResultAvailabilityLineAfter', {
    bindings: { parentCtrl: '<'},
    template: `
      <oadoi-results ng-if="{{$ctrl.showOnResultsPage}} && !{{$ctrl.isFullView}}">
        <div layout="flex" ng-if="$ctrl.best_oa_link" class="layout-row" style="margin-top: 5px;">
          <prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_lock_open_24px"></prm-icon>
          <a class="arrow-link-button md-primoExplore-theme md-ink-ripple" style="margin-left: 3px; margin-top: 3px;"
             target="_blank" href="{{$ctrl.best_oa_link}}"><strong>Open Access</strong> available via unpaywall</a>
          <prm-icon link-arrow icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-right"></prm-icon>
        </div>
        <div class="layout-row">
          <table ng-if="$ctrl.debug">
            <tr><td><strong>doi</strong></td><td>{{$ctrl.doi}}</td></tr>
            <tr><td><strong>is_OA</strong></td><td>{{$ctrl.is_oa}}</td>
            <tr><td><strong>best_oa_link</strong></td><td>{{$ctrl.best_oa_link}}</td></tr>
          </table>
        </div>
      </oadoi-results>`,
    controller:
      function oadoiResultsCtrl(oadoiOptions, $scope, $element, $http) {
        // ensure that preference is set to display
        var self = this;
        self.showOnResultsPage = oadoiOptions.showOnResultsPage;
        if(!self.showOnResultsPage){ return; }
        self.debug = oadoiOptions.debug;

        // get the item from the component's parent controller
        var item = this.parentCtrl.result;
        try{

          // obtain doi and open access information from the item PNX (metadata)
          var addata = item.pnx.addata;
          if(addata){
            this.doi = addata.hasOwnProperty("doi")? addata.doi[0] : null; //default to first doi (list)
            this.is_oa = addata.hasOwnProperty("oa"); //true if property is present at all (regardless of value)
          }

          // if there's a doi and it's not already open access, ask the oadoi.org for an OA link
          if(this.doi && !this.is_oa){
            $http.get("https://api.oadoi.org/v2/"+this.doi+"?email="+oadoiOptions.email)
              .then(function(response){
                // if there is a link, save it so it can be used in the template above
                self.best_oa_link = (response.data.best_oa_location)? response.data.best_oa_location.url : "";
              }, function(error){
                if(self.debug){
                  console.log(error);
                }
              });
          }
        }catch(e){
          if(self.debug){
            console.log("error caught in oadoiResultsCtrl: " + e);
          }
        }
      }
  });
