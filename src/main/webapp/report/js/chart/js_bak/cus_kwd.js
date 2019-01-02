$(document).ready(function() {
	
(function() {
	
	var cusKwdAssoNetwork = function(sv) {
		this.data = [];
		this.sv   = sv || 5;
	};
	
	cusKwdAssoNetwork.prototype = {

		setData: function(kwdAssoDataset) {
			
			if (!kwdAssoDataset.data || !kwdAssoDataset.data.length) {
				alert("kwdAssoDataset 조회불가");
				return;
			}

			kwdAssoDataset.data = kwdAssoDataset.data.sort(function(a, b) { // 오름차순
    		return b['freqBoth'] - a['freqBoth'];
			});

			var t = kwdAssoDataset.data;
			var n = {};
			var r = [];

			for (var i = 0; i < t.length; i++) {
				if (!n[t[i].kwdB]) n[t[i].kwdB] = [];
				n[t[i].kwdB].push(t[i]);
			}

			for (var el in n) {
				var nt  = {};
				var sum = 0;
				for (var i = 0; i < n[el].length; i++) {	
					sum += n[el][i].freqBoth;
				}

				r.push({title: n[el][0].kwdB, value: sum});
			}

			

			this.data = r; 
			cusKwdAssoNetwork.rawData = r;

			return this;
		},
		
		onDrawChart: function() {
			
			var that = this;
			var data = that.data;
			
			//1. 슬라이드 바 그리기
			var slider = document.getElementById("sliderBar");
			var curSv  = this.sv;
			slider.innerHTML = "<input type='range' min='1' max='20' value='" + curSv + "' class='slider' id='myRange' style='width:100%;'><span id='demo' style='font-weight:bold; color:black'></span>";
			
			var slider = document.getElementById("myRange");
			var output = document.getElementById("demo");
			output.innerHTML = slider.value;
			
			slider.oninput = function() {
			    output.innerHTML = this.value;
			}
			
			//2. 네트워크 차트 그리기 준비
			var keyword=$(".search_box_inp").val().trim();
			var myNetworkChart = echarts.init(document.getElementById('network'));
			
		     var option = {
		    		 title : {
		    			 text: $(".search_box_inp").val().trim(),
		    			 top:'top',
		    			 left:'left'
		    				 },
		    		 
		    		 tooltip: {},
				     series: [
				    	 {
				    		 type: 'graph',
				    		 layout: 'force',
				    		 force: {
				    			 repulsion: 1000,
				    			 edgeLength: 50,
				    			 layoutAnimation: true
				    			 },
				    		 symbol: 'circle',
				    		 symbolSize: 50,
				             categories: [
				            	 {name: '인물'},
				            	 {name: '상품'},
				            	 {name: '기타'}
				            	 ],
				            roam: false,
				            label: {
				            	show: true,
				            	position: 'inside',
				            	color: 'black'
				            },		         
				            data:[],      
				            links:[]            	           
				        }
				    ]
				};//option 끝
		    
		    var _t1 = [{name: keyword, symbolSize: 70, itemStyle: {color: '#c4ccd3'}}]; var _t2 = [];
		    for (var el in data) {
		    	_t1.push({name: data[el]["title"], value: data[el]["value"]}); 
		    	_t2.push({source: data[el]["title"], target: keyword}); 
		    }
		    option.series[0].data = _t1.slice(0, slider.value);
		    option.series[0].links = _t2.slice(0, slider.value);
		    
		    myNetworkChart.setOption(option); 
		    
		    var curS = document.getElementById('#sliderBar');
		    $('#sliderBar').on('mouseup', '#myRange', function(ch) {
		    	console.log(SDII.Chart.cusKwdAssoNetwork.rawData);
		    	var rawData = SDII.Chart.cusKwdAssoNetwork.rawData;
		    	
		    	var keyword = $(".search_box_inp").val().trim();
			    var _t1 = [{name: keyword, symbolSize: 70, itemStyle: {color: '#c4ccd3'}}]; var _t2 = [];
			    for (var el in rawData) {
			    	_t1.push({name: rawData[el]["title"], value: rawData[el]["value"]}); 
			    	_t2.push({source: rawData[el]["title"], target: keyword}); 
			    }
			    newOpts = ch.getOption();
			    
			    newOpts.series[0].data = _t1.slice(0, slider.value);
			    newOpts.series[0].links = _t2.slice(0, slider.value);
			    ch.setOption(newOpts);
		    	
		    }.bind(curS, myNetworkChart));  
		}
	};
	
	window.SDII.Chart.cusKwdAssoNetwork = window.SDII.Chart.cusKwdAssoNetwork || cusKwdAssoNetwork;
	
})(window);
});