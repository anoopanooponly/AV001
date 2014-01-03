/**
 * Created by ams on 12/18/13.
 */
//Articles service used for articles REST endpoint
angular.module('mean.userservice').factory("UserService", ['$resource', function($resource) {
    return $resource('/chat', {

        update: {
            method: 'PUT'

        }
    });
}]);