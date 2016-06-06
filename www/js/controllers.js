angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope,$rootScope,$state,$ionicHistory,$ionicPopup,$ionicHistory,$ionicLoading,$cordovaCamera) {
  
    //$ionicLoading.show({template: '<ion-spinner class="spinner-calm"></ion-spinner>',});
   $scope.finishTrip=function(){
      var finishTrip = $ionicPopup.confirm({title: 'Finish current trip',template: 'Are you sure?'});
      
      finishTrip.then(function(res) {
         if(res) {
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
            
            window.localStorage.removeItem('trip');
            $state.go('starttrip');
            //$ionicLoading.hide();
         } 
      });
   } 

    
})

.controller('bycatchCtrl', function($scope,$cordovaCamera,$ionicPopup,$cordovaSQLite) {
  
  $scope.takePicture = function () {
    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA
    };

    $cordovaCamera.getPicture(options).then(function(imageURI) {
     var image = document.getElementById('myImage');
      $scope.myImage = imageURI;

      $cordovaSQLite.execute(db, "INSERT INTO image VALUES (null,'"+imageURI+"')");
      //$ionicPopup.alert({title: 'Oops',template: imageURI});
      //$scope.url=imageURI;
      window.localStorage.setItem('url',imageURI);
      //window.localStorage.setItem('imgurl':'imageURI');
      //console.log(imageURI);
    }, function(err) {
      console.log('222222222222222222222');
    });

    //$cordovaCamera.cleanup().then();

    // only for FILE_URI
                /*var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true
                };
  
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        //console.log('camera data:' + angular.tojson(data));
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        $state.go("menu.bycatch");
                        //$scope.imagedata=imageData;
                        //cosole.log(imageData);
                        //$ionicPopup.alert({title: 'Oops',template:"data:image/jpeg;base64," + imageData}); 
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });*/
                }

      $scope.submitByCatch=function(){
        var a=window.localStorage.getItem('url');
        console.log(a);
        $ionicPopup.alert({title: 'Oops',template: a});
      }
     
      $scope.choosePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    
                };

                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
      }
})

.controller('loginCtrl', function($scope, $state,$cordovaSQLite,md5,$ionicPopup,$http) {
    
    $scope.login = function(user){
    	var query = "SELECT * FROM user WHERE email ='"+user.email+"' AND password='"+md5.createHash(user.password)+"' AND type='Scientific Observer'";
        $cordovaSQLite.execute(db, query).then(function(res) {
        	if(res.rows.length ==1) {
              window.localStorage.setItem('email',res.rows.item(0).email);//store current user in locat storage
            	$state.go('starttrip');
            } else {
                //$scope.message="The Email and Password you entered, don't match.";   
                $ionicPopup.alert({title: 'Oops',template: 'The Email and Password you entered, dont match.'}); 
                user.password="";
            }
        }, function (err) {
            console.error(err);
        });     
    }

     $scope.forgotPassword = function() {
    
      var promptPopup = $ionicPopup.prompt({
         title: 'Forgot Password?',
         template: 'Enter email of your account.',
         inputType: 'email',
         inputPlaceholder: 'Email'
      });
        
      promptPopup.then(function(res) {
         if(res){
            $http.post("http://minmin.esy.es/php/app/forgot_password.php",{ "email" : res}).
            success(function(data) {
                if(data=="1"){
                    $ionicPopup.alert({title: 'Email sent',template: 'Password change link was sent to your email.'});
                }else if(data=="0"){
                    $ionicPopup.alert({title: 'Try again',template: 'There is not MIN account to this email.'});
                }else{
                    $ionicPopup.alert({title: 'Try again',template: 'Something went wrong.'});
                }
            }).error(function(data) {
                $ionicPopup.alert({title: 'Try again',template: 'Check your internet connection.'});
            });

         }else{
            $ionicPopup.alert({title: 'Oops',template: 'Enter a correct email.'});
         }
      });
        
    };
})

.controller('menuCtrl', function($scope,$state,$cordovaSQLite,$ionicPopup,$cordovaFileTransfer,$ionicLoading) {
    $scope.logout = function(){
      if(window.localStorage.getItem('trip')){
        $ionicPopup.alert({title: 'Logout ?',template: 'Finish current trip before logout.'}); 

        
      }else{
        window.localStorage.removeItem('email');
        $state.go('login');
      }
        
    }

    $scope.upload=function(){
      $ionicLoading.show({template: '<ion-spinner class="spinner-calm"></ion-spinner>',});

      $cordovaSQLite.execute(db, "SELECT * FROM image")
      .then(function(res) {
        var options = {
            fileKey: "file",
            fileName: "image.png",
            chunkedMode: false,
            mimeType: "image/png"
        };
        $ionicLoading.show({template: '<ion-spinner class="spinner-calm"></ion-spinner>',});
        $cordovaFileTransfer.upload(encodeURI("http://minmin.esy.es/php/app/upload.php"), res.rows.item(0).url, options).then(function(result) {
            console.log("SUCCESS: " + JSON.stringify(result.response));
             $ionicLoading.hide();
        }, function(err) {
            console.log("ERROR: " + JSON.stringify(err));
             $ionicLoading.hide();
        }, function (progress) {
            // constant progress updates
        });

      },function (err) {
        console.log('eeeeeeeeeeeeee');
      });
    }
})

.controller('dataManagerCtrl', function($scope,$cordovaSQLite) {
    /*var query = "SELECT * FROM download_log";
    $cordovaSQLite.execute(db, query).then(function(res) {
        $scope.downdata=res;
    }, function (err) {
        console.error(err);
    });*/
})

.controller('vesselCtrl', function($scope,$ionicPopup) {
  $scope.vesselDetails =function(boat){
    $cordovaSQLite.execute(db, "SELECT * FROM boat WHERE reg_no="+boat.regno)
    .then(function(res) {
      if(res.rows.length ==1) {
        window.localStorage.setItem('boat_reg_no',boat.regno);
        $ionicPopup.alert({title: 'Success',template: 'Boat found'});
      }else{
        $ionicPopup.alert({title: 'Oops',template: 'Invalid Boat reg no,Try again.'});
      }
    },function (err) {
      console.log('eeeeeeeeeeeeee');
    });
  }
})

.controller('testCtrl', function($scope,$ionicPopup,$cordovaSQLite) {
   $cordovaSQLite.execute(db, "SELECT * FROM image")
    .then(function(res) {
      document.getElementById('testImage').src=res.rows.item(0).url;

      console.log(res.rows.length+" "+res.rows.item(0).url);
      $ionicPopup.alert({title: 'Oops',template:res.rows.item(0).id+" "+res.rows.item(0).url});
      
    },function (err) {
      console.log('eeeeeeeeeeeeee');
    });
})

.controller('gearCtrl', function($scope) {

})

.controller('operationCtrl', function($scope) {

})

.controller('startTripCtrl', function($scope,$state,$ionicHistory) {
  //$ionicLoading.show({template: '<ion-spinner class="spinner-calm"></ion-spinner>',});
  $scope.start = function(){
    window.localStorage.setItem('trip',"open");
    $state.go('menu.home');
  }
})