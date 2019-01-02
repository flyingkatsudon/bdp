/*
 * trend.js
 * - insight report trend chart comm
 *
 * 
 * 18.09
 *
 * JayKeem
 *
 * jaykeem@weni.co.kr
*/

$(document).ready(function() {

(function(global) {


	var trend = function() {
		this.trendType = "";
		this.chartData = {};
		this.emoData   = {};
		this.top3Data  = {};
		this.cpnyNames = [];
	}

	trend.prototype = {

		setData: function(ajaxData) {

			var d   = ajaxData.data;
					nms = ajaxData.cnames;
				  n   = {};
				  k   = {};
				  e   = {};

			for (var i = 0; i < d.length; i++) {

				var curDate = moment.unix(d[i].docDate / 1000).format("YYYY-MM-DD");
				d[i].d = curDate;
				if (!n[curDate]) {
					n[curDate] = [];
					k[curDate] = [];
					e[curDate] = [];
				}

				//if (d[i] < 100) continue;
				n[curDate].push(d[i]);
			}

			var res2 = []; var nr   = {}; var rows = []; var rCnt = 0;

			for (var el in n) {

				if (n[el].length == 0) continue;
				
				var tDate = n[el][0].d;

				if (!nr[el]) nr[el] = {};

				for (var i = 0; i < n[el].length; i++) {
					var cName = n[el][i].kwdA;
					if (!nr[el][cName]) nr[el][cName] = [];
					nr[el][cName].push(n[el][i]);
				}

				//console.log(nr);
				if (!rows[rCnt]) rows[rCnt] = [];

				var test1 = nms;
				var tArr  = [new Date(moment.unix(n[el][0].docDate / 1000))];

				for (var i = 0; i < test1.length; i++) {

					if (!nr[el][test1[i]]) {
						var ii = (i * 2) + 1;
						tArr[ii] = 0;
						tArr[ii + 1] = "";
						e[el][i] = [["긍정", 0, 0], ["부정", 0, 0]];
						k[el][i] = [["데이터없음", 0]];

					} else {

						var p1 = Math.round(nr[el][test1[i]][0].posCnt / nr[el][test1[i]][0].cnt * 100);
						var p2 = Math.round(nr[el][test1[i]][0].negCnt / nr[el][test1[i]][0].cnt * 100);
						e[el][i] = [["긍정", nr[el][test1[i]][0].posCnt, p1], ["부정", nr[el][test1[i]][0].negCnt, p2]];	

						var tp = [];

						for (j = 0; j < nr[el][test1[i]].length; j++) {
					 		tp.push([nr[el][test1[i]][j].kwdB, nr[el][test1[i]][j].freqBoth]);
						}
						k[el][i] = tp;
					}

					var curList = nr[el][test1[i]];
					if (!curList) continue;
					tArr.push(curList[0].freqBoth);
					tArr.push("");
				}

				rows[rCnt++] = tArr;
				res2.push(k[el]);
			}

			this.top3Data  = k;
			this.chartData = rows;
			this.emoData   = e;
			this.cpnyNames = nms;
			return this;
		},

		onDrawChart: function() {

			var that     = this,
					fromDate = $(".flatpickr input[name='date_from']").val(),
					toDate   = $(".flatpickr input[name='date_to']").val();

			var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
			var ctrlOpts = {
				controlType: "ChartRangeFilter",
				containerId: "ctrl_trend",
				state: {
					range: {
						start: new Date(moment(fromDate).format("YYYY/MM/DD")), //new Date(2018, 8, 1), 
						end  : new Date(moment(toDate).add(5, "days").format("YYYY/MM/DD"))// new Date(2018, 9, 30)
					}
				},
				options: {
					// Filter by the date axis.
					filterColumnIndex: 0,
					ui: {
					  chartType: "LineChart",
			    	curveType: 'function',
					  chartOptions: {
							chartArea: {
								width: "90%", height: "40px"
							},
							colors: ["none"],
							//vAxis: {
								//viewWindow : {min: -2}
							//},
							hAxis: {
								baselineColor: "none", 
								format: "dd.MM.yyyy" 
							},
					  },
					   // Display a single series that shows the closing value of the stock.
					   // Thus, this view has two columns: the date (axis) and the stock value (line series).
					  	chartView: {
								columns: [0, 1]
					  	},
					   // 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
					   minRangeSize: 86400000
					}
				}
			};

			var chartOpts = {
				chartType: "LineChart",
	   		containerId: "chart_trend",
	   		options: {
			  	lineWidth: 1,
					theme: {
			    	chartArea: {margin:0, width: "90%", height: "70%"},
			    },
		      animation:{
		      	startup: true,
		        duration: 1000,
		        easing: 'inAndOut',
		      },
			    title: '신한은행 뉴스브리핑',
			    //titlePosition: "out",
			    titleTextStyle: {
			    	fontSize: 20,
			    	color: "rgba(255,255,0,0.5)",
			    },
					tooltip: {
						trigger: "both",
						isHtml : true
					},
			    curveType: 'function',
			    //focusTarget: 'category',
			    //pointSize: 2,
			    //pointShape: 'square',
			    legend: { 
			    	position: 'top', 
			    	alignment: "end",
			    	textStyle: {
			    		fontSize: 16
			    	}
			    },
			    hAxis: {
			    	 gridlines: {
			      	color:  "none"
			      },
			    	format: "yyyy-MM-dd" 
			    },
			    vAxis: { 
			      //viewWindowMode:'maximized',
			      //textPosition: "none",
			      viewWindow:{
			      	//max:55,
			        min:-2
			      }
			    },

			    series: {
			    	/*
			      0: { color: "#3366CC", lineDashStyle: [1, 1]},//lineDashStyle: [1, 1] },
			      1: { color: "#DC3912", lineDashStyle: [1, 1] },
			      2: { color: "#FF9900", lineDashStyle: [1, 1] },
			      3: { color: "#109618", lineDashStyle: [1, 1] }
						*/

			      0: { color: "#00B3F9", lineDashStyle: [1, 1]},//lineDashStyle: [1, 1] },
			      1: { color: "#91D03C", lineDashStyle: [1, 1] },
			      2: { color: "#FF5663", lineDashStyle: [1, 1] },
			      3: { color: "#00D2ED", lineDashStyle: [1, 1] }
					},
					
			    crosshair: {
			    	color: '#bbb',
			    	opacity: 1,
		 				trigger: 'both',
		        orientation: 'both'
					}
	   		}
			};

			//var tooltipDiv = $("#chart_trend_piechart").get(0);
	    //var tooltipChart = new google.visualization.PieChart(tooltipDiv);
	    var dataRows = that.chartData,
	   			top3Rows = that.top3Data,
	   			emoRows  = that.emoData,
	   			cnames   = that.cpnyNames,
	   			tCnt     = 0;

	    console.log(dataRows);
	 		console.log(top3Rows);
	 		console.log(emoRows);
	 		tCnt = (dataRows[0].length - 1) / 2;

	    for (var i = 0; i < dataRows.length; i++) {

	    	var tDate = moment(dataRows[i][0]).format("YYYY-MM-DD");

	    	for (var j = 0; j < tCnt; j++) {

	    		var pieDataTb = new google.visualization.DataTable();
			    pieDataTb.addColumn("string", "category");
			    pieDataTb.addColumn("number",  "count");
			    pieDataTb.addColumn({
						type: "number",
		    		label: "null",
		    		role: "tooltip"
		    	});
			    pieDataTb.addRows(emoRows[tDate][j]);
	    	
	    		var tooltipDiv   = $("#chart_trend_piechart").get(0);
		      var tooltipChart = new google.visualization.PieChart(tooltipDiv);
		      var curDate      = reqDate = moment(dataRows[i][0]).format("YYYY-MM-DD");
		      google.visualization.events.addListener(tooltipChart, 'ready', function(subIdx, curName, curDate) {

		    		$("svg rect:first", "#chart_trend_piechart").attr("width", 220);
		    		$("svg g g text", "#chart_trend_piechart").each(function (i, v) {

					  	$(this).text(pieDataTb.getValue(i, 2) + (i == 0 ? "%(긍정)" : "%(부정)"));
				    	$(this).attr("x", parseInt($(this).attr("x")) - 25);
				    	$circle = $(this).parent().next();
				    	$circle.attr("cx", parseInt($circle.attr("cx")) - 25);
				  	});
				    //var tooltipImg = "<img src='" + tooltipChart.getImageURI() + "'>";

				    var curTop3 = top3Rows[tDate][subIdx];
				    $tdv = $("<div class='chart_trend_top3_list'></div>");
				   	for (var z = 0; z < curTop3.length; z++) {
				   		$ta = $("<a onclick='top3Action(this);' data-type='top3'>" + curTop3[z][0] +" " +  curTop3[z][1] + "건</a>");
				    	$tdv.append($ta).append("<br/>");
				    }

				   
				   $("#chart_trend_top3")
			    		.append(
			    			"<div class='chart_trend_top3_title'>이슈키워드" + 
			    				"<span class='chart_trend_top3_title_sub'>( " + curName + ", " + curDate + ")</span>" +
			    			"</div>"
		    			).append($tdv);

			    	$("#chart_trend_abs")
			    		.append("<div class='chart_trend_top3_title'>긍/부정 현황</div>");

			    	if (curTop3[0][1] != 0) {
				    	$("#chart_trend_ctrl")
				    		.append("<a onclick='emoAction(this);'>[연관어]</a>")
				    		.append("<a onclick='chanelAction(this);'>[긍/부정 연관어]</a>");
						}
			    	/*$("#chart_trend_abs")
			    		.append("<div><span class='top3_cnt'>" +  dataRows[i][1] + "건</span></div>");
			    	*/		    	
			    	dataRows[i][(subIdx * 2) + 2] = $(".chart_trend_tooltip").html();

						$("#chart_trend_abs").html("");
				    $("#chart_trend_piechart").html("");
				    $("#chart_trend_top3").html("");
				    $("#chart_trend_ctrl").html("");

	    		}.bind(this, j, cnames[j], curDate));

	    		tooltipChart.draw(pieDataTb, {
		    		colors: ["#2f4554", "#c23531"],
		    		//pieHole: 0,
		    		pieSliceText: "none",
		    		tooltip: {
		    			trigger: 'selection',
		    		},
		        theme: {
				    	chartArea: {margin:0, width: "95%", height: "95%"},
				    }, 
				    legend: { 
			    		position: 'end',
			    		textStyle: {fontSize: 14}
				    },
				    //is3D: true
	    		});
	    	}
	    }
	    
			var data = new google.visualization.DataTable();
		 	data.addColumn({
		 		role: "domain",
		 		type: "date",
		 		lable: "Date"
		 	});

		 	for (var i = 0; i < cnames.length; i++) {
		 		data.addColumn('number', cnames[i]);
		    data.addColumn({
		    	type: "string",
		    	label: "null",
		    	role: "tooltip"
		    	,p: {html: true}
		    });
		 	}
	    data.addRows(dataRows);
	    
			var control  = new google.visualization.ControlWrapper(ctrlOpts);
			var chart    = new google.visualization.ChartWrapper(chartOpts); 

			google.visualization.events.addOneTimeListener(chart, 'ready', function(chart) {


				var tgtRow  = chart.getDataTable().getViewRows().length - 1,
						colSize = chart.getDataTable().getViewColumns().length,
						cmpArr  = [], cateCnt = 0, maxVal = 0;
				cateCnt = (colSize - 1) / 2;
				
			 	google.visualization.events.addListener(chart, 'select', function(chart, cateCnt) {


					var tTgt   = $("#dashboard_trend svg path"),
						  tgtIdx = 3,
						  slct   = chart.getChart().getSelection();

					if (!slct || slct.length == 0) return;

					for (var i = 0 ; i < cateCnt; i++) {
						$(tTgt.get(i + 3)).attr("stroke-width", 1).attr("stroke-dasharray", "1,1");
					}

					tgtIdx = (slct[0].column  - 1) / 2 + cateCnt;
					$(tTgt.get(tgtIdx)).attr("stroke-width", 3).attr("stroke-dasharray", "0");

					var ttData  = chart.getDataTable().getValue(slct[0].row, slct[0].column + 1);
					var top1Key = $("a", ttData)[0].text.split(" ")[0];
					var top3Key = [];
					var reqDate = moment(chart.getDataTable().getValue(slct[0].row, 0)).format("YYYY-MM-DD");

					//channelAction(chart.getDataTable().getColumnLabel(slct[0].column));

					$(ttData).find("[data-type='top3']").each(function (idx, el) { 
							top3Key.push(el.text.split(" ")[0]);
					});
					$(".chart_network").html("");
					SDII.Globals.Func.onRequestKwdNetwork(top3Key.join(","), reqDate, chart.getDataTable().getColumnLabel(slct[0].column));
					if (top1Key == "데이터없음") {
						alert("조회할 데이터가 없습니다.");
						return;
					}

					channelAction(top1Key, chart.getDataTable().getColumnLabel(slct[0].column));

				}.bind(this, chart, cateCnt));

				for (var i = 0; i < cateCnt; i++) {
					cmpArr.push(chart.getDataTable().getValue(tgtRow, (i * 2) + 1));
				}
				maxVal = Math.max.apply(this, cmpArr);
				tgtCol = cmpArr.indexOf(maxVal) * 2 + 1;
				//chart.getChart().setSelection([{column: tgtCol, row: tgtRow}]);

				var reqDate = moment(chart.getDataTable().getValue(tgtRow, 0)).format("YYYY-MM-DD");
				var ttDom    = $(chart.getDataTable().getValue(tgtRow, tgtCol + 1));
				var top3Dom  = $("a", ttDom).slice(0, cateCnt);
				var newKeys  = [];
				top3Dom.each(function (idx, el) {
					newKeys.push(el.text.split(" ")[0]);
				});

				$(".chart_network").html("");
				SDII.Globals.Func.onRequestKwdNetwork(newKeys.join(","), reqDate, chart.getDataTable().getColumnLabel(tgtCol));

				/*
				var boldLine = (tgtCol - 1) / 2 + cateCnt - 1;
				$($("#dashboard_trend svg path").get(boldLine)).attr("stroke-width", 3);
				*/
				//console.log(cmpArr); console.log(tgtCol);

			}.bind(this, chart));

		 	dashboard.bind(control, chart);
		  dashboard.draw(data);
		}
	}

	global.SDII.Chart.trendChart = global.SDII.Chart.trendChart || trend;

})(window);

});