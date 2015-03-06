angular.module('Administrator')
.directive("articleTabs", function() {
  return {
    restrict: "E",
    templateUrl: "./templates/directives/articleTabs.html",
    transclude: true,
    controller: function() {
      this.tab = 1;

      this.isSet = function(checkTab) {
        return this.tab === checkTab;
      };

      this.setTab = function(activeTab) {
        this.tab = activeTab;
      };
    },
    controllerAs: "tab"
  };
});
