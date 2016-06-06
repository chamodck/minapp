// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
//i used app ass my module name in whole project
var db = null;
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives','ngCordova','angular-md5'])
.run(function($ionicPlatform,$cordovaSQLite,$rootScope,$http,$ionicPopup,$cordovaNetwork,$state,$ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    if(window.localStorage.getItem('email')){
      if(window.localStorage.getItem('trip')){
        $state.go('menu.home');
      }else{
        $state.go('starttrip');
      }
    }else{
      $state.go('login');
    }
    
    $state.go('starttrip');
    
    db=$cordovaSQLite.openDB({name: "min.db",location: 1});//open sqlite db
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS user (id integer primary key, email text, fname text,lname text,password text,type text,contact_no text,latest_update integer)");


      
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS download_log (id integer)");
    //$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS logged_user(id integer, email text,fname text,lname text,type text,contact_no text)");

      
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS boat(id integer primary key , reg_no integer,iotc_reg_no integer,name text,length integer,fishing_gear text,storage_capacity integer)");
      
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS gear (id integer primary key AUTOINCREMENT, type text, main_mat text,main_len integer,float_line integer,branch_line integer,tot_hooks integer,hooks_boys integer,type_hooks integer,tori_len integer,streamers_per_line integer,streamers_type text,streamers_len integer,noline_cutters integer,node_hookers integer)"); 
      
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS operation (id integer primary key AUTOINCREMENT, no_of_days integer, mainline_length integer,branch_length integer,sets_per_trip integer,bait_type text,bait_species text,bait_ratio integer,sampling_method text,dye_color text,species_code text,no_fish integer,weight integer,weight_code text,legth integer,length_code text)");  


    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS download_log (id integer)");
    //$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS logged_user(id integer, email text,fname text,lname text,type text,contact_no text)");


    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS download_log (id integer)");
    //$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS logged_user(id integer, email text,fname text,lname text,type text,contact_no text)");

    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS boat(id integer primary key, reg_no integer,iotc_reg_no integer,name text,length integer,fishing_gear text,storage_capacity integer)");

    $cordovaSQLite.execute(db,"CREATE TRIGGER IF NOT EXISTS markUpdateLogOnInsert AFTER INSERT ON user BEGIN INSERT INTO download_log VALUES (new.latest_update);END;");
    $cordovaSQLite.execute(db,"CREATE TRIGGER IF NOT EXISTS markUpdateLogOnUpdate AFTER UPDATE ON user BEGIN INSERT INTO download_log VALUES (new.latest_update);END;");
    //$cordovaSQLite.execute(db, "INSERT INTO download_log (row_num) VALUES (?)", [0]);
  });

  function downloadData(){
    $cordovaSQLite.execute(db, "SELECT * FROM download_log")
      .then(function(res) {
        var row_num=0;
        if(res.rows.length > 0) {
          row_num=res.rows.item(res.rows.length-1).id;
        }
        console.log(row_num);

         $http.post("http://minmin.esy.es/php/app/getChangedDataList.php?row_num="+(row_num+1))//get below rows of row_num
        .then(function(response) {
              var array=response.data.records;
              $rootScope.downdata=[];//set array to display download data list
              for (var i=0;i<array.length;i++){
                (function(counter,array0) {//counter define as the increment array0=array , those are visible in http methods.
                  if(array0[counter].type == "delete"){

                    var query = "SELECT * FROM "+array0[counter].table_name+" WHERE id ="+array0[counter].rowid;
                    $cordovaSQLite.execute(db, query).then(function(res) {
                      if(res.rows.length == 1) {
                        $cordovaSQLite.execute(db, "DELETE FROM "+array0[counter].table_name+" WHERE id="+array0[counter].rowid);
                      }
                    }, function (err) {
                        console.error(err);
                    });
                  }else{
                    $http.post("http://minmin.esy.es/php/app/getChangedData.php?id="+array0[counter].rowid+"&table="+array0[counter].table_name)
                    .then(function(response) {
                      var array1=response.data;
                      //console.log(array0[counter].rowid);
                      //$rootScope.message=array0[counter].rowid;
                      if(array1.id == array0[counter].rowid){
                        
                        var query = "SELECT * FROM "+array0[counter].table_name+" WHERE id ="+array1.id;
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            if(res.rows.length ==1) {
                                
                              if(array0[counter].table_name=="user"){
                                var query = "UPDATE user SET id=?,email=?,fname=?,lname=?,password=?,type=?,contact_no=?,latest_update=? WHERE id=?";
                                $cordovaSQLite.execute(db, query,[array1.id,array1.email,array1.fname,array1.lname,array1.password,array1.type,array1.contact_no,array0[counter].id,array1.id]).then(function(res) {
                                  $rootScope.downdata.push({"id":array1.id,"type":"Update"});
                                  console.log("uuuuuuuuuuuuuuuuu Userrrrrrrrrrr");
                                }, function (err) {
                                    console.log('11111111111111111');
                                    return 0;
                                });

                              }else if(array0[counter].table_name=="boat"){
                                 var query = "UPDATE boat SET id=?,reg_no=?,iotc_reg_no=?,name=?,length=?,fishing_gear=?,storage_capacity=? WHERE id=?";
                                $cordovaSQLite.execute(db, query,[array1.id,array1.email,array1.fname,array1.lname,array1.password,array1.type,array1.contact_no,array0[counter].id,array1.id]).then(function(res) {
                                  $rootScope.downdata.push({"id":array1.id,"type":"Update"});
                                  console.log("uuuuuuuuuuuuuuuuu Boatttttttttt");
                                }, function (err) {
                                    console.log('11111111111111111');
                                    return 0;
                                });
                              }

                            } else {
                              if(array0[counter].table_name=="user"){
                                var query = "INSERT INTO user VALUES(?,?,?,?,?,?,?,?)";
                                $cordovaSQLite.execute(db, query, [array1.id,array1.email,array1.fname,array1.lname,array1.password,array1.type,array1.contact_no,array0[counter].id]).then(function(res) {
                                  $rootScope.downdata.push({"id":array1.id,"type":"New"});
                                  console.log("iiiiiiiiiiiiii user");
                                }, function (err) {
                                    console.log('2222222222222222222');
                                    return 0;
                                });
                              }else if(array0[counter].table_name=="boat"){
                                var query = "INSERT INTO boat VALUES(?,?,?,?,?,?,?)";
                                $cordovaSQLite.execute(db, query, [array1.id,array1.reg_no,array1.iotc_reg_no,array1.name,array1.length,array1.fishing_gear,array1.storage_capacity]).then(function(res) {
                                  $rootScope.downdata.push({"id":array1.id,"type":"New"});
                                  console.log("iiiiiiiiiiiiiiiiiiiii boat");
                                }, function (err) {
                                    console.log('2222222222222222222');
                                    return 0;
                                });
                              }
                              
                            }

                        }, function (err) {
                            console.error(err);
                        });
                      }
                              
                    });
                  }
                
              }(i,array));
 
              }
            
            
          });
        
      }, function (err) {
          console.error(err);
      });
  }

  window.addEventListener("online", function(e) {
    $ionicLoading.show({template: '<ion-spinner class="spinner-calm"></ion-spinner>',});
    downloadData();
    $ionicLoading.hide();
  }, false);    
 
  window.addEventListener("offline", function(e) {
    console.log("went offline");
  }, false); 
    
  
  //setInterval(onDeviceReady,3000);
    function onDeviceReady() {
            navigator.geolocation.getCurrentPosition(onSuccess,onError,{enableHighAccuracy: true});
            
        }
    function onSuccess(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            console.log("lat : "+lat+" lng : " +lng);

        }

    function onError(error) {
            console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        }

/*
document.addEventListener('deviceready', function () {
    // Android customization 
    cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});
    // Enable background mode 
    cordova.plugins.backgroundMode.enable();
 
    // Called when background mode has been activated 
    cordova.plugins.backgroundMode.onactivate = function () {
        setTimeout(function () {
          console.log('222222222222222222222222222222');
            // Modify the currently displayed notification 
            cordova.plugins.backgroundMode.configure({
                text:'Running in background for more than 5s now.'
            });
        }, 5000);
    }
}, false);*/

})