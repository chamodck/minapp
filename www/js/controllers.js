angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope,$state,$ionicHistory,$ionicPopup,$ionicHistory,$ionicLoading,$cordovaSQLite) {
  
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
   
   $scope.finishTrip=function(){
       var query = "SELECT * FROM gear";
                    $cordovaSQLite.execute(db, query).then(function(res) {
                             $ionicPopup.alert({title: 'success ?',template:res.rows.length });               
                    }, function (err) {
                        console.error(err);
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

.controller('menuCtrl', function($scope,$state,$cordovaSQLite,$ionicPopup) {
    $scope.logout = function(){
      if(window.localStorage.getItem('trip')){
        $ionicPopup.alert({title: 'Logout ?',template: 'Finish current trip before logout.'}); 

        
      }else{
        window.localStorage.removeItem('email');
        $state.go('login');
      }
        
    }

    /*$scope.datamanager = function(){
        $state.go('menu.dataManager');
    }*/
})

.controller('dataManagerCtrl', function($scope,$cordovaSQLite) {
    /*var query = "SELECT * FROM download_log";
    $cordovaSQLite.execute(db, query).then(function(res) {
        $scope.downdata=res;
    }, function (err) {
        console.error(err);
    });*/
})

.controller('vesselCtrl', function($scope,$ionicPopup,$cordovaSQLite) {
  $scope.vesselDetails =function(boat){
    $cordovaSQLite.execute(db, "SELECT * FROM boat WHERE reg_no="+boat.regno)
    .then(function(res) {
      if(res.rows.length ==1) {
        window.localStorage.setItem('boat_reg_no',boat.regno);
      }else{
        $ionicPopup.alert({title: 'Oops',template: 'Invalid Boat reg no,Try again.'});
      }
    },function (err) {
      console.log('eeeeeeeeeeeeee');
    });

  }
})


.controller('gearCtrl', function($scope,$cordovaSQLite,$ionicPopup) {
$scope.gear = function(gearDetails){
    var query_gear = "INSERT INTO gear VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    $cordovaSQLite.execute(db,query_gear,
    [gearDetails.type,gearDetails.mainlinemeterial,gearDetails.mainlinelength,gearDetails.floatlinelength,gearDetails.branchlinelength,gearDetails.hooksbetweenboys,gearDetails.typeofhooks,gearDetails.torilinelength,gearDetails.streamersperline,gearDetails.streamerstype,gearDetails.streamerslength,gearDetails.nolinecutters,gearDetails.nolinecutters,gearDetails.nodehookers])
    .then(function(res){
        $ionicPopup.alert({title: 'success ?',template: 'successfully added'}); 
    }, function (err) {
       console.log('insert error');
       return 0;                            
    });
}
})

.controller('operationCtrl', function($scope) {
$scope.gear = function(gearDetails){
    var query_operation = "INSERT INTO gear VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    $cordovaSQLite.execute(db,query_operation,
    [operationDetails.NoDays,operationDetails.MainLine,operationDetails.BranchLength,operationDetails.SetsPerTrip,operationDetails.BaitType,operationDetails.BaitSpecies,operationDetails.BaitRatio,operationDetails.SamplingMethod,operationDetails.DyeColor,operationDetails.SpeciesCode,operationDetails.NoFish,operationDetails.Weight,operationDetails.WeightCode,operationDetails.Length,operationDetails.LengthCode])
    .then(function(res){
    }, function (err) {
       console.log('insert error');
       return 0;                            
    });
}
})


.controller('startTripCtrl', function($scope,$state,$ionicHistory) {
  //$ionicLoading.show({template: '<ion-spinner class="spinner-calm"></ion-spinner>',});
  $scope.start = function(){
    
    window.localStorage.setItem('trip',"open");
    $state.go('menu.home');
  }
})