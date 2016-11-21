angular.module("grumblr", ["ui.router", "ngResource"])
  .config([
    "$stateProvider",
    RouterFunction
  ])
  .controller("GrumbleIndexController", [
    "GrumbleFactory",
    GrumbleIndexControllerFunction
  ])
  .controller("GrumbleShowController", [
    "GrumbleFactory",
    "$stateParams",
    GrumbleShowControllerFunction
  ])
  .factory("GrumbleFactory", [
    "$resource",
    GrumbleFactoryCallback
  ])

  function GrumbleFactoryCallback($resource){
    return $resource("http://localhost:3000/grumbles/:id", {}, {
      update: {method: "PUT" }
    });
  };

  function RouterFunction($stateProvider){
    $stateProvider
    .state("grumbleIndex", {
      url: "/grumbles",
      templateUrl: "js/ng-views/index.html",
      controller: "GrumbleIndexController",
      controllerAs: "indexVm"
    })
    .state("grumbleShow", {
      url: "/grumbles/:id",
      templateUrl: "js/ng-views/show.html",
      controller: "GrumbleShowController",
      controllerAs: "showVm"
    });
  }

  function GrumbleIndexControllerFunction(GrumbleFactory){
    var indexVm = this;
    indexVm.grumbles = GrumbleFactory.query();
    indexVm.newGrumble = new GrumbleFactory();

    indexVm.create = function($state){
      indexVm.newGrumble.$save().then(function(res){
        indexVm.grumbles.push(res)
      })
    };
  }

  function GrumbleShowControllerFunction(GrumbleFactory, $stateParams){
    var showVm = this;
    showVm.grumble = GrumbleFactory.get({id: $stateParams.id});

    showVm.update = function() {
      showVm.grumble.$update({id: $stateParams.id});
    };

    showVm.delete = function() {
      showVm.grumble.$delete({id: $stateParams.id});
    };
  };
