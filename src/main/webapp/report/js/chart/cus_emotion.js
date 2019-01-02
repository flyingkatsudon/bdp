$(document).ready(function() {
	
(function() {
	
	var cusEmotionChart = function() {
		this.chartTitle=null;
		this.data = {};
	};
	
	cusEmotionChart.prototype = {
		setData: function() {
			var chartTitle='감성 연관어';
			var data = {
				positiveBar : {
					title: '긍정어',
					xAxis : [963, 655, 412, 394, 377, 292, 294, 281, 171, 206],
					yAxis : ['역대최고', '강세', '안전', '기대되다', '즐기다', '강화하다', '빠른', '세계최초', '좋은', '최적']
				},
				negativeBar : {
					title: '부정어',
					xAxis : [312, 279, 260, 255, 221, 214, 205, 156, 154, 136],
					yAxis : ['긴장하다', '무용지물', '혐의', '반발', '늑장신고', '늑장', '불법', '난항', '우려', '심하다']
				}
			};
			this.chartTitle=chartTitle;
			this.data=data;
			
			return this;
		},
		
		onDrawChart: function() {

			var that = this;
			var chartTitle = that.chartTitle;
			var data = that.data;
			
			//HTML div태그 가져오기
			var positiveBar=document.getElementById("positiveBar");
			var negativeBar=document.getElementById("negativeBar");
			
			//div태그 가져온거 이차트 초기화
			var myPositiveBarChart=echarts.init(positiveBar);
			var myNegativeBarChart=echarts.init(negativeBar);
			
			//차트 옵션설정
			var basicOption = {
					title: {
					    text: null,
					},
					tooltip: {
					    trigger: 'axis',
					    axisPointer: {
					        type: 'shadow'
					    }
					},
					legend: {
					    data: null
					},
					grid: {
					    left: '3%',
					    right: '4%',
					    bottom: '3%',
					    containLabel: true
					},
					xAxis: {
					    type: 'value',
					    boundaryGap: [0, 0.01],
					    inverse: null
					},
					yAxis: {
					    type: 'category',
					    data: [],
					    position: 'right',
					    inverse: true
					},
					series: [
					    {
					        name: null,
					        type: 'bar',
					        data: [],
					        itemStyle:{color:'green'}
					    }
					]
			};
				
			basicOption.title.text=data.positiveBar.title;
			basicOption.legend.data=[data.positiveBar.title];
			basicOption.yAxis.data=data.positiveBar.yAxis;
			basicOption.series[0].data=data.positiveBar.xAxis;
			basicOption.xAxis.inverse=true;
			basicOption.series[0].itemStyle={color:'#2f4554'};
			myPositiveBarChart.setOption(basicOption);
			
			
			basicOption.title.text=data.negativeBar.title;
			basicOption.legend.data=[data.negativeBar.title];
			basicOption.yAxis.data=data.negativeBar.yAxis;
			basicOption.series[0].data=data.negativeBar.xAxis;
			basicOption.series[0].itemStyle={color:'#c23531'};
			basicOption.xAxis.inverse=false;
			basicOption.yAxis.position='left';
			myNegativeBarChart.setOption(basicOption);
		}
	};
	
	window.SDII.Chart.cusEmotionChart = window.SDII.Chart.cusEmotionChart || cusEmotionChart;
	
})(window);
});