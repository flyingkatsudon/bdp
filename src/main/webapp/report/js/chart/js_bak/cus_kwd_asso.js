$(document).ready(function() {
	
(function() {
	
	var cusKwdAssoChart = function() {
		this.xAxis = [];
		this.yAxis = [];
	};
	
	cusKwdAssoChart.prototype = {
		setData: function(kwdAssoDataset) {

			var xAxis=[];
			var yAxis=[];
			
			kwdAssoDataset.data = kwdAssoDataset.data.sort(function(a, b) { // 오름차순
			    return b['freqBoth'] - a['freqBoth'];
			});
			
			var t = kwdAssoDataset.data;
			var n = {};

			for (var i = 0; i < t.length; i++) {
				if (!n[t[i].kwdB]) n[t[i].kwdB] = [];
				n[t[i].kwdB].push(t[i]);
			}

			for (var el in n) {

				var nt  = {};
				var sum = 0;
				yAxis.push(n[el][0].kwdB);

				for (var i = 0; i < n[el].length; i++) {	
					sum += n[el][i].freqBoth;
				}
				xAxis.push(sum);
			}
			
			xAxis = xAxis.slice(0, 25);
			yAxis = yAxis.slice(0, 25);
			/*

			for(var i = 0; i < kwdAssoDataset.data.length; i++) {
				xAxis.push(kwdAssoDataset.data[i].freqBoth);
				yAxis.push(kwdAssoDataset.data[i].kwdB);
			}
			*/
			this.xAxis = xAxis; 
			this.yAxis = yAxis; 
			
			return this;
		},
		
		onDrawChart: function() {
			
			var that = this;
			var xAxis = that.xAxis;
			var yAxis = that.yAxis;
			
			var chartOptBase = {
				    title: {
				        text: '전체',
				    },
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'shadow'
				        }
				    },
				   /* legend: {
				        data: ['전체']
				    },*/
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis: {
	                    type: 'value',
	                    min: 0,
	                    max: Math.floor((xArr[0] * 1.2)/100) * 100,
	                    axisLabel: {rotate: 50, interval: 0}  
	                },
				    yAxis: {
				        type: 'category',
				        inverse: true,
				        data: yAxis
				    },
				    series: [
				        {
				            name: '전체',
				            type: 'bar',
				            label: {
				            	normal: {
				            		position: 'right',
				            		show: true
				            	}
				            },
				            data: xAxis,
				            itemStyle:{color:'skyblue'}
				        }
				    ]
				};
				
				var parent  = document.getElementById("barChart");
				var myBarChart = echarts.init(parent);
				myBarChart.setOption(chartOptBase);
		}
	};
	
	window.SDII.Chart.cusKwdAssoChart = window.SDII.Chart.cusKwdAssoChart || cusKwdAssoChart;
	
})(window);
});
