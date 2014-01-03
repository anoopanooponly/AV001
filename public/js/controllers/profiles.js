angular.module('mean.profiles').controller('ProfileController', ['$scope', '$routeParams', '$location', 'Global', 'Profile', function ($scope, $routeParams, $location, Global, Profile) {
 $scope.global = Global;
 //$scope.profile = User.publicProfile;
 $scope.find = function() {
 Articles.query(function(articles) {
 $scope.articles = articles;
 });
 };

 $scope.showPublicProfile = function() {
 Profile.query( function(publicProfile) {
        $scope.profile = publicProfile;
 });
 };

$scope.savePublicProfile = function() {
    var profile = new Profile();
    profile = $scope.profile;
        profile.lastUpdated = new Date().getTime();
    Profile.update(function() {
            $location.path('publicProfile');
        });
    };
 }]);

