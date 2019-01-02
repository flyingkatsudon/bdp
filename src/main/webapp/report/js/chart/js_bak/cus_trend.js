
$(document).ready(function() {
	
(function() {
	
	var cusTrendChart = function() {
		this.sourceArr = [];
	};
	
	cusTrendChart.prototype = {
		setData: function(trendDataset) {
			var sourceArr    = [];
			var dateArr      = ['buzzAmt'];
			var categoryArr1 = ['NEWS'];
			var categoryArr2 = ['SNS'];
			var categoryArr3 = ['COMMUNITY'];
			var categoryArr4 = ['BLOG'];
			var categoryArr5 = ['ETC'];
			
			//Sort Date ASC
			trendDataset.data = trendDataset.data.sort(function(a, b) {return a['docDate'] - b['docDate'];});

			//for date
			dateArr.push(moment(trendDataset.data[0].docDate).format("YY/MM/DD"));

			for(var i = 1; i < trendDataset.data.length; i++) {
				//날짜 중복제거
				if(trendDataset.data[i-1].docDate != trendDataset.data[i].docDate) {
					var tData = moment(trendDataset.data[i].docDate).format("YY/MM/DD");
					dateArr.push(tData);
				}
			}
			
			//for NEWS
			for(var i = 0; i < dateArr.length; i++) {

				if (!trendDataset.data[i] || !trendDataset.data[i].categoryCode) {
					//console.log("Type : " + i);
					//console.log(trendDataset.data[i]);
					continue;
				}

				if (trendDataset.data[i].categoryCode == 1) {//Case 1. NEWS					
					categoryArr1.push(trendDataset.data[i].docCntBoth);
				} else {
					categoryArr1.push(0);
				}

				if (trendDataset.data[i].categoryCode == 2) {//Case 1. SNS					
					categoryArr2.push(trendDataset.data[i].docCntBoth);
				} else {
					categoryArr2.push(0);
				}
				categoryArr3.push(0);
				categoryArr4.push(0);
				categoryArr5.push(0);
			}

			sourceArr.push(dateArr);
			sourceArr.push(categoryArr1);
			sourceArr.push(categoryArr2);
			sourceArr.push(categoryArr3);
			sourceArr.push(categoryArr4);
			sourceArr.push(categoryArr5);
			
			this.sourceArr = sourceArr; 
			
			return this;
		},
		
		onDrawChart: function() {
			
			var that = this;
			var sourceArr = that.sourceArr;
			var trendChart=document.getElementById("trend")
			var myTrend=echarts.init(trendChart);
				
			setTimeout(function () {

			    var option = {
			        legend: {},
			        tooltip: {
			            trigger: 'axis',
			            showContent: true
			        },
			        dataset: {
			            source: sourceArr
			        },
			        xAxis: {type: 'category'},
			        yAxis: {gridIndex: 0},
			        grid: {x: '7%', y: '7%', width: '50%', height: '30%'},
			        series: [
			            {type: 'line', seriesLayoutBy: 'row'},
			            {type: 'line', seriesLayoutBy: 'row'},
			            {type: 'line', seriesLayoutBy: 'row'},
			            {type: 'line', seriesLayoutBy: 'row'},
			            {type: 'line', seriesLayoutBy: 'row'},
			            {
			                type: 'pie',
			                id: 'pie',
			                radius: ['30%', '20%'],
			                center: ['80%', '20%'], //75 75
			                label: {
			                    formatter: '{b}: {@'+sourceArr[0][(sourceArr[0].length)-1]+'} ({d}%)'
			                },
			                encode: {
			                    itemName: 'buzzAmt',
			                    value: sourceArr[0][(sourceArr[0].length)-1],
			                    tooltip: sourceArr[0][(sourceArr[0].length)-1]
			                }
			               // xAxisIndex: 0, yAxisIndex: 0
			            }
			        ]
			    };

			    myTrend.on('updateAxisPointer', function (event) {
			    	
			        var xAxisInfo = event.axesInfo[0];
			        if (xAxisInfo) {
			            var dimension = xAxisInfo.value + 1;
			            myTrend.setOption({
			                series: {
			                    id: 'pie',
			                    //center: ['75%', '75%']
			                    label: {
			                        formatter: '{b}: {@[' + dimension + ']} ({d}%)'
			                    },
			                    encode: {
			                        value: dimension,
			                        tooltip: dimension
			                    } 
			                }
			                
			            });//setoption end
			        }
			    });//function end

			    myTrend.setOption(option);
			});
		}
	};
	
	window.SDII.Chart.cusTrendChart = window.SDII.Chart.cusTrendChart || cusTrendChart;
	
})(window);
});
