///<reference path="/js/angular.min.js/>"

var ser=angular.module('app.services', ['ngCookies'])

/*.factory('BlankFactory', [function(){

}])
*/

//this is for the login with username and passwords
ser.factory('Auth' , function($cookieStore) {

	var _user = $cookieStore.get('app.user');//in here app means angular module name in app.js
	var setUser = function(user){
		_user=user;
		$cookieStore.put('app.user' , _user);
	}

	return{
		setUser : setUser ,
		isLoggedIn: function(){
			return _user ? true :false;			
		},
		getUser : function(){
			return _user;
		},
		logout: function(){
			$cookieStore.remove('app.user');
			_user =null;
		}
	}
})

ser.service('BlankService', [function(){

}]);

