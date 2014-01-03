'use strict';

/* Controllers */
angular.module('mean.chat', ['ui.bootstrap' ]);
function AppCtrl($scope, socket,Global, UserService) {

  // Socket listeners
  // ================
    $scope.currentuser = Global;
  socket.on('init', function (data) {
    $scope.name = data.name;
    $scope.users = data.users;
  });

  socket.on('send:message', function (message) {

//    $scope.messages.push(message);
      console.log('socket.on:snd message' + message.name);
      // add the message to our model locally
      var flag = false;
      for(var i=0;i< $scope.messages.length;i++)
      {
          if($scope.messages[i].messagefor == message.name)
          {
              $scope.messages[i].messageslist.push({name:message.name,message:message.message});
              flag = true;
              break;
          }
      }

      if(!flag)
          $scope.messages.push({
              messagefor: window.user.email,
              messageslist: [{name:  message.name,
                  message :message.message}]


          });

      console.log("message received:" + $scope.messages);

  });

  socket.on('change:name', function (data) {
    changeName(data.oldName, data.newName);
  });

  socket.on('user:join', function (data) {
    $scope.messages.push({
      chatuser: 'chatroom',
      text: 'User ' + data.name + ' has joined.'
    });
    $scope.users.push(data.name);
  });


    socket.on('user:joinforchat', function (data) {
        console.log("logged in users list:" +  data);
        $scope.loggedInUserList = data;


        for (var key in $scope.loggedInUserList) {
            var flag = false;
            if ($scope.loggedInUserList.hasOwnProperty(key)) {
                console.log($scope.loggedInUserList[key]);
                for(var i=0;i< $scope.messages.length;i++)
                {
                    if($scope.messages[i].messagefor == key)
                    {

                        flag = true;

                    }
                }

                if(!flag)
                    $scope.messages.push({
                        messagefor: key,
                        typedval:'',
                        messageslist: []


                    });
            }
        }
//        for(var j=0;j< $scope.loggedInUserList.length;j++)
//        {
//            for(var i=0;i< $scope.messages.length;i++)
//            {
//                if($scope.messages[i].messagefor == $scope.loggedInUserList[j].name)
//                {
//
//                    flag = true;
//
//                }
//            }
//
//            if(!flag)
//                $scope.messages.push({
//                    messagefor: $scope.loggedInUserList[j].name,
//                    messageslist: []
//
//
//                });
//        }

        });



    // add a message to the conversation when a user disconnects or leaves the room
  socket.on('user:left', function (data) {
    $scope.messages.push({
     chatuser: 'chatroom',
      text: 'User ' + data.name + ' has left.'
    });
    var i, user;
    for (i = 0; i < $scope.users.length; i++) {
      user = $scope.users[i];
      if (user === data.name) {
        $scope.users.splice(i, 1);
        break;
      }
    }
  });

  // Private helpers
  // ===============

  var changeName = function (oldName, newName) {
    // rename user in list of users
    var i;
    for (i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i] === oldName) {
        $scope.users[i] = newName;
      }
    }

    $scope.messages.push({
      chatuser: 'chatroom',
      text: 'User ' + oldName + ' is now known as ' + newName + '.'
    });
  }

  // Methods published to the scope
  // ==============================

  $scope.changeName = function () {
    socket.emit('change:name', {
      name: $scope.newName
    }, function (result) {
      if (!result) {
        alert('There was an error changing your name');
      } else {
        
        changeName($scope.name, $scope.newName);

        $scope.name = $scope.newName;
        $scope.newName = '';
      }
    });
  };

    $scope.userJoin = function () {
        console.log("hereee--" + $scope.global.user.email);
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

  $scope.messages = [];
  $scope.loggedInUserList = [];

    $scope.sendMessage1 = function(msg)
    {
        console.log(msg);
    }
  $scope.sendMessage = function (chatto, message1) {
      console.log(message1);
      socket.emit('send:message', {

      message: message1, name :chatto, currentuser : window.user.email
    });
      console.log("logged in user:--" + window.user.email);

    // add the message to our model locally
    var flag = false;
    for(var i=0;i< $scope.messages.length;i++)
    {
        if($scope.messages[i].messagefor == chatto)
        {
            $scope.messages[i].messageslist.push({name:window.user.email,message:message1});
            flag = true;
            break;
        }
    }

     if(!flag)
    $scope.messages.push({
        messagefor: name,
        typedval :'',
        messageslist: [{name: window.user.email,
                    message :message1}]


    });
      this.messagetyped ='';


  };


    $scope.userslist = function() {
        UserService.query( function(clients) {

            $scope.clients = clients;
            $scope.loggedInUserList = clients;

            var flag = false;
            for(var j=0;j< $scope.loggedInUserList.length;j++)
            {

                    $scope.messages.push({
                        messagefor: $scope.loggedInUserList[j].name,
                        typedval:'',
                        messageslist: []


                    });
                }

        });
    };
    $scope.userslist();

}
