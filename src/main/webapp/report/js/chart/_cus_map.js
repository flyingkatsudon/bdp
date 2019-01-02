$(document).ready(function() {
	
(function() {
	
	var cusMap = function() {
		this.myLatLng = {};
	};
	
	cusMap.prototype = {
		setData: function() {
			var myLatLng = {lat: 37.532600, lng: 127.024612};//서울 임시하드코딩
			
			this.myLatLng=myLatLng;
			
			return this;
		},
		
		onDrawChart: function() {

			var that = this;
			var myLatLng = that.myLatLng;
			
			var keyword='brand';
			var map = new google.maps.Map(document.getElementById('map'), {
				center: myLatLng,
				zoom: 6
			});

			
			// Create a marker and set its position.
			var marker = new google.maps.Marker({
				map: map,
				position: myLatLng,
				title: 'Hello World!'
				//icon: 'img/icon/'+keyword+'.png'
			});
		}
	};
	
	window.SDII.Chart.cusMap = window.SDII.Chart.cusMap || cusMap;
	
})(window);
});