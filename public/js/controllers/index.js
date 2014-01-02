angular.module('mean.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global, socket) {
    $scope.global = Global;




    $scope.userJoin = function () {
        console.log("hereee--" + $scope.global.user.email);
        var socket = io.connect();
        socket.emit('user:joinforchat', {
            name: $scope.global.user.email
        }, function (result) {
            if (!result) {
                alert('Error in joining');
            } else {
                $scope.name = $scope.global.user.email;

            }
        });
    };

    if($scope.global.authenticated)
    {
        console.log('authenticated');
        $scope.userJoin();
    }
}]);