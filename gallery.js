var GALLERYBUILDER = {
		init: function(DATA){
			var photos = this.getPhotoUrls(DATA.photoset.photo).reverse();
			console.log(photos);
		},
		currentSlide: 0,
		getPhotoUrls: function(photos){
			var photoURLs = photos.map(function(obj) {
				var host = 'https://c1.staticflickr.com/';
				var photoSize = '_b.jpg';
				var photo = obj.id + '_' + obj.secret + photoSize;
				return host + obj.farm + '/' + obj.server + '/' + photo;
			})
			return photoURLs
		},
		makeGallery: function(photos){
			var photoGallery = document.createElement('ul');
			var listItem = document.createElement('li');
			var image = document.createElement('img');

		},
		nextSlide: function(currentSlide){
			this.goToSlide(currentSlide + 1);
		},
		backSlide: function(currentSlide){
			this.goToSlide(currentSlide - 1);
		},
		goToSlide: function(slides,n){

		},
}
GALLERYBUILDER.init(PHOTOSET);