angular.module('app.directives', [])

.directive('myDirective', function($cordovaSQLite) {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function myValidation(value) {
                 $cordovaSQLite.execute(db, "SELECT * FROM boat")
                 .then(function(res) {
                    var flag=0;
                    for (var i=0;i < res.rows.length;i++){
                        console.log(res.rows.item(i).reg_no);
                        if(res.rows.item(i).reg_no==value){
                            mCtrl.$setValidity('charE', true);
                            flag=1;
                        }
                        
                    }
                    if(flag==0){
                        mCtrl.$setValidity('charE', false);
                    }
                    
                    return value;
                 },function (err) {
                    console.log('eeeeeeeeeeeeee');
                 });  
            }
            mCtrl.$parsers.push(myValidation);
        }
    };
});