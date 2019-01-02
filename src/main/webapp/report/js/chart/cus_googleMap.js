$(document).ready(function() {
	
(function() {
	var cusMap = function() {
		this.mapDataArr = [];
	};
	
	cusMap.prototype = {
		addCusInfoWindow: function(map) {
			//infoWindow
			//2. InfoWindow content
			var myLatLng={lat: 37.5669756, lng: 126.9891145}; //ShinhanLife L-Tower
			

			var marker = new google.maps.Marker({
				position: myLatLng,
				map: map
			});

			new google.maps.Circle({
		         strokeColor: '#91c7ae',
		         strokeOpacity: 0.8,
		         strokeWeight: 2,
		         fillColor: '#91c7ae',
		         fillOpacity: 0.35,
		         map: map,
		         center: myLatLng,
		         radius: 1000
			});

			var content = '<div id="iw-container">' +
			                    '<div class="iw-title">신한생명 본사</div>' +
			                    '<div class="iw-content">' +
			                      '<div class="iw-subTitle">정보</div>' +
			                      '<img src="img/icon/ltower.png" alt="ltower" height="115" width="83">' +
			                      '<p>신한생명은 지난 11일 경기 용인시 용인치과의사회 회의실에서 전북대학교 치과대학 총동창회와 소호수량스 영업확대를 위한 업무제휴 협약을 체결했다고 13일 밝혔다.</p>' +
			                      '<div class="iw-subTitle">Contacts</div>' +
			                      '<p>주소: 서울특별시 중구 을지로3가 95-7<br>'+
			                      '<br>연락처: 02-3279-1951<br>e-mail: shinhanlife@naver.com<br>http://www.shinhanlife.co.kr</p>'+
			                    '</div>' +
			                    '<div class="iw-bottom-gradient"></div>' +
			                  '</div>';

			// A new Info Window is created and set content
			var infowindow = new google.maps.InfoWindow({
				content: content,
			    maxWidth: 350
			});
			  
			// This event expects a click on a marker
			// When this event is fired the Info Window is opened.
		    google.maps.event.addListener(marker, 'click', function() {
		    	infowindow.open(map, marker);
			});

			// Event that closes the Info Window with a click on the map
			google.maps.event.addListener(map, 'click', function() {
			    infowindow.close();
			});

			// *
	     	// START INFOWINDOW CUSTOMIZE.
			// The google.maps.event.addListener() event expects
			// the creation of the infowindow HTML structure 'domready'
			// and before the opening of the infowindow, defined styles are applied.
			// *
			google.maps.event.addListener(infowindow, 'domready', function() {

			// Reference to the DIV that wraps the bottom of infowindow
			var iwOuter = $('.gm-style-iw');

			/* Since this div is in a position prior to .gm-div style-iw.
			* We use jQuery and create a iwBackground variable,
			* and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
			*/
			var iwBackground = iwOuter.prev();

		    // Removes background shadow DIV
			iwBackground.children(':nth-child(2)').css({'display' : 'none'});

			// Removes white background DIV
			iwBackground.children(':nth-child(4)').css({'display' : 'none'});

			// Moves the infowindow 115px to the right.
			iwOuter.parent().parent().css({left: '115px'});

			// Moves the shadow of the arrow 76px to the left margin.
			iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

			// Moves the arrow 76px to the left margin.
		    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

			// Changes the desired tail shadow color.
			iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

		    // Reference to the div that groups the close button elements.
			var iwCloseBtn = iwOuter.next();

			// Apply the desired effect to the close button
			iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});

			// If the content of infowindow not exceed the set maximum height, then the gradient is removed.
			if($('.iw-content').height() < 140){
				$('.iw-bottom-gradient').css({display: 'none'});
			}

		    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
		    iwCloseBtn.mouseout(function(){
		    	$(this).css({opacity: '1'});
			});
		  });	
		},	
		
		addCircle: function(mapDataArr, map) {
			var myLatLng={lat:mapDataArr.lat , lng:mapDataArr.lng};			
			var cityCircle = new google.maps.Circle({
		         strokeColor: '#91c7ae',
		         strokeOpacity: 0.8,
		         strokeWeight: 2,
		         fillColor: '#91c7ae',
		         fillOpacity: 0.35,
		         map: map,
		         center: myLatLng,
		         radius: 1000
			});	
		},	
			
		addMarker: function(mapDataArr, map) {
			var myLatLng={lat:mapDataArr.lat , lng:mapDataArr.lng};
			
			var marker = new google.maps.Marker({
				position: myLatLng,
				map: map
			});
					  
			var infowindow = new google.maps.InfoWindow({
			    content: "<div class='sns_link'>" + mapDataArr.content + "</div>"
		    });


			$(".sns_link").on("click", function() {
				window.open($(this).text(), "", "width=1200,height=600");
			});
			marker.addListener('click', function() {
	        infowindow.open(map, marker);
	    });
		
		},
			
		setData: function(mapDataset) {
			var mapDataArr = [];
			var center={lat: 37.5638369, lng: 126.9862784}; // ShinhanCard Head: Map Start Center
			
	
			for(var i = 0; i < mapDataset.data.length; i++) {
				mapDataArr.push({content: mapDataset.data[i].docContent, lat: mapDataset.data[i].lat, lng: mapDataset.data[i].lon});
			}
			
			this.mapDataArr = mapDataArr; 
			this.center = center;
	
			return this;
		},
		
		onDrawChart: function() {
			var that = this;
			var mapDataArr = that.mapDataArr;
			var center = that.center;//ShinhanCard Head
			
			var myMap=document.getElementById("googleMap");
			
			var mapOption = {
					center: center,
					zoom: 12, // control size of zoom-map; (ex) 8-South Korea, 12-Seoul, 15-Seoul Jung-gu
					mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			// Draw map
			var map = new google.maps.Map(myMap, mapOption);
			
			// Add Markers & Circles
			for(var i=0; i<mapDataArr.length; i++) {
				window.SDII.Chart.cusMap.prototype.addMarker(mapDataArr[i], map); //Markers
				//window.SDII.Chart.cusMap.prototype.addCircle(mapDataArr[i], map); //Circles
			}
			
			// Add InfoWindow 
			window.SDII.Chart.cusMap.prototype.addCusInfoWindow(map);
	
		}
	};
	
	window.SDII.Chart.cusMap = window.SDII.Chart.cusMap || cusMap;
	
})(window);
});