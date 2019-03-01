var myapp=angular.module('uploadapp',['ngRoute','ngStorage'])
myapp.controller('uploadmemecontroller',['$location','$http','$rootScope','$window','$sessionStorage',function($location,$http,$rootScope,$sessionStorage){
    var main=this;
    console.log("hello hello")
    this.clicking=function(){
      $location.path('/signup')
    }



}])
myapp.controller('signupcontroller',['$location','$http','$rootScope',function($location,$http,$rootScope){
    var main=this;
    this.clicking=function(){
        var mydata={
            username:main.username,
            password:main.password
        }
        $http.post('/api/newuser',mydata)
        .then((response)=>{
         console.log(response)
         alert("User Created You can login now")
        })

      }
      this.logging=function(){
          $location.path('/login')
      }


}])
myapp.controller('logincontroller',['$location','$http','$rootScope',function($location,$http,$rootScope){
    var main=this;
    this.clicking=function(){
        var mydata={
            username:main.username,
            password:main.password
        }
        $http.post('/api/existinguser',mydata)
        .then((response)=>{
         console.log(response.data.user)
         $location.path('/userlogin/'+response.data.user.username)
         
        })

      }

    


}])

myapp.controller('userlogincontroller',['$location','$http','$rootScope','$routeParams',function($location,$http,$rootScope,$routeParams){
    var main=this;
    this.userdetails=''
    var mydata={
        username:$routeParams.username,
        
    }
    this.getuserinfo=function(){
        $http.post('/api/userdetails',mydata)
        .then((response)=>{
        main.userdetails=response.data.user
        console.log(main.userdetails)
        })
    }
    this.clicking=function(){
        $location.path('/userimages/'+main.userdetails.username)
    }
    this.getuserinfo()

    


}])

myapp.controller('userimagescontroller',['$location','$http','$rootScope','$routeParams',function($location,$http,$rootScope,$routeParams){
    var main=this;
    
    this.username=$routeParams.username
    this.userdetails=''
    var mydata={
        username:$routeParams.username,
        
    }
    this.getuserimages=function(){
        $http.post('/api/userimages',mydata)
        .then((response)=>{
        
        console.log(response)
        main.userdetails=response.data.images
        })
    }
    
    this.getuserimages()

    


}])