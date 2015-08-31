angular.module("exampleApp")
	.constant("baseUrl", "http://calm-coast-6141.herokuapp.com/api/images/")
	.controller("imagesCtrl", function ($scope, $http, baseUrl) {
		$scope.displayMode = "list";

		$scope.currentProduct = null; 

		$scope.listImages = function () {
			$http.get(baseUrl).success(function (data) {
				$scope.images = data; 
			})
		}

		$scope.deleteImage = function (image) {
			$http({
				method: "DELETE",
				url: baseUrl + image._id
			}).success(function () {
				$scope.images.splice($scope.images.indexOf(image), 1);
			});
		}

		// $scope.createProduct = function (product) {
		// 	$scope.products.push(product); 
		// 	$scope.displayMode = "list";
		// }

		// $scope.updateProduct = function (product) {
		// 	for (var i = 0; i < $scope.products.length; i++) {
		// 		if ($scope.products[i].id == product.id) {
		// 			$scope.products[i] = product;
		// 			break;
		// 		}
		// 	}
		// 	$scope.displayMode = "list"
		// }

		// $scope.editOrCreateProduct = function (product) {
		// 	$scope.currentProduct = product ? angular.copy(product) : {};
		// 	$scope.displayMode = "edit";
		// }

		// $scope.saveEdit = function (product) {
		// 	if (angular.isDefined(product.id)) {
		// 		$scope.updateProduct(product);
		// 	} else {
		// 		$scope.createProduct(product);
		// 	}
		// }

		// $scope.cancelEdit = function () {
		// 	$scope.currentProduct = {};
		// 	$scope.displayMode = "list";
		// }

		$scope.listImages();

		$scope.renderImageUrl = function(image) {
			return baseUrl + image._id;
		}

	});