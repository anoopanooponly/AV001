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
     if(publicProfile.length)
        $scope.profile = publicProfile[0];
     else
         $scope.profile = new Profile();
 });
 };
$scope.savePublicProfile = function() {
        var profile = $scope.profile;
        profile.lastUpdated = new Date().getTime();
    profile.$update(function() {
            $location.path('publicProfile');
        });
    };
 }]);

