var setReviewGrader = angular.module('setReviewGrader', ['ngRoute', 'ngStorage']);

setReviewGrader.config(function ($routeProvider, $locationProvider) {
  //$routeProvider.when('/articles', {
  //  templateUrl: '/html/articles/getIndex.html',
  //  controller: 'articlesController'
  //})
  //.when('/articles/:articlesId', {
  //  templateUrl: '/html/articles/get.html',
  //  controller: 'articleController'
  //}).otherwise({
  //  redirectTo: '/articles'
  //});

  $locationProvider.html5Mode(true);
});
