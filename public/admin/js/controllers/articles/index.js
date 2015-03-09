angular.module('Administrator')
.controller('ArticlesIndexController', ["$scope", "Articles",
    function($scope, Articles) {
        var _controller = this;
        $scope.articles = Articles.query(function(_data) {
            for (var i=0, x=_data.length; i<x; i++) {
                _data[i].publish_date = new Date(_data[i].publish_date);
            }
        });
        $scope.articleOrder = "publish_date";
        $scope.articleOrderDir = true;
        $scope.setArticleOrder = function( value ) {
            if ($scope.articleOrder == value) {
                if ($scope.articleOrderDir) {
                    $scope.articleOrderDir = false;
                } else {
                    $scope.articleOrderDir = true;
                }
            } else {
                $scope.articleOrder = value;
            }
        } // close setArticleOrder
        $scope.isActiveOrder = function( value ) {
            return ($scope.articleOrder == value);
        }
    }
]);
