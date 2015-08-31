angular.module('exampleApp', ['ngResource'])
	.factory('ImagesFactory', function ($resource) {
	    return $resource('/api/images', {}, {
	        query: { method: 'GET', isArray: true },
	        create: { method: 'POST' }
	    })
	})
	.factory('ImageFactory', function ($resource) {
	    return $resource('/api/images/:id', {}, {
	        show: { method: 'GET' },
	        update: { method: 'PUT', params: {id: '@id'} },
	        delete: { method: 'DELETE', params: {id: '@id'} }
	    })
	});
