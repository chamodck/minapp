angular.module('app.routes', ['app.services'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl', //this wil be used to login auth
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl',
    abstract:true
  })

  .state('menu.home', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })
    
  .state('starttrip', {
    url: '/start_trip',
    templateUrl: 'templates/start_trip.html',
        controller: 'startTripCtrl'
  })

  .state('menu.dataManager', {
    url: '/dataManager',
    views: {
      'side-menu21': {
        templateUrl: 'templates/data_manager.html',
        controller: 'dataManagerCtrl'
      }
    }
  })

  .state('menu.vessel', {
    url: '/vessel',
    views: {
      'side-menu21': {
        templateUrl: 'templates/vessel_details.html',
        controller: 'vesselCtrl'
      }
    }
  })

  .state('menu.gear', {
    url: '/gear',
    views: {
      'side-menu21': {
        templateUrl: 'templates/gearDetails.html',
        controller: 'gearCtrl'
      }
    }
  })

  .state('menu.operation', {
    url: '/operation',
    views: {
      'side-menu21': {
        templateUrl: 'templates/operationDetails.html',
        controller: 'operationCtrl'
      }
    }
  })

  .state('menu.bycatch', {
    url: '/bycatch',
    views: {
      'side-menu21': {
        templateUrl: 'templates/bycatch.html',
        controller: 'bycatchCtrl'
      }
    }
  })

  .state('menu.test', {
    url: '/test',
    views: {
      'side-menu21': {
        templateUrl: 'templates/test.html',
        controller: 'testCtrl'
      }
    }
  })

  if(window.localStorage.getItem('email')){
    $urlRouterProvider.otherwise('side-menu21/page1')
  }else{
    $urlRouterProvider.otherwise('/login')
  }
  

});