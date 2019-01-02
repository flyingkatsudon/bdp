/*
 * report.js
 * - insight report base script
 *
 * 
 18.09
 *
 * JayKeem
 *
 * jaykeem@weni.co.kr
*/

(function() {

	function getToday(k) {return getDate(new Date(), k);}

	function getDate(obj, k) {

		if (!obj || !obj instanceof Date)  obj = new Date();

		if (!k) k = "";

		$target  = obj;
		$tMon    = (($target.getMonth() + 1) + "").padStart(2, "0");
		$tDate   = ($target.getDate() + "").padStart(2, "0");
		return [$target.getFullYear(), $tMon, $tDate].join(k);
	}

	window.channelAction = function(t, p) {

		$.ajax({

			url: 'http://13.209.38.43:8080/bdp/cus/get_trd',
			type: 'post',
        	contentType: 'application/json; charset=utf-8',
			dataType: 'json',
	    data: JSON.stringify({
				kwd: t,
				startDate: $("input[name=date_from]").val(),
				endDate: $("input[name=date_to]").val(),
		    	period: "day"
	    }),
	    success: function(trendResult) {
	    	if (!trendResult.isSuccess) {
	    		alert("데이터 요청에 실패하였습니다.");
	    		return;
	    	}

	    	$(".chart_trend_sub_wrap").slideDown();
				$("#chart_trend_sub").html("");
				$("#chart_trend_sub").append("<div class='chart_trend_sub_title'>채널별 검색키워드 : " + p + "/" + t + "</div>");
				$("#chart_trend_sub").append("<div id='chart_trend_sub_area'></div>");

	    	var d = trendResult.data;

				var chartOpts = {
			  	lineWidth: 1,
					theme: {
			    	chartArea: {margin:0, width: "90%", height: "80%"},
			    },
		      animation:{
		      	startup: true,
		        duration: 1000,
		        easing: 'inAndOut',
		      },
			    //title: "none",
			    titleTextStyle: {
			    	fontSize: 20,
			    	color: "rgba(255,255,0,0.5)",
			    },
					tooltip: {
						trigger: "both",
					},
			    curveType: 'function',
			    legend: {
			    	position: "top",
			    	alignment: "end"
			    },
			    hAxis: {
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
			      0: { color: "#3366CC", lineDashStyle: [0]},//lineDashStyle: [1, 1] },
			      1: { color: "#DC3912", lineDashStyle: [0] },
			      2: { color: "#FF9900", lineDashStyle: [0] },
			      3: { color: "#109618", lineDashStyle: [0] }
			      /*
			      0: { color: "#00B3F9", lineDashStyle: [1, 1]},//lineDashStyle: [1, 1] },
			      1: { color: "#91D03C", lineDashStyle: [1, 1] },
			      2: { color: "#FF5663", lineDashStyle: [1, 1] },
			      3: { color: "#00D2ED", lineDashStyle: [1, 1] }
			      */
					},
					
			    crosshair: {
			    	color: '#bbb',
			    	opacity: 1,
		 				trigger: 'both',
		        orientation: 'both'
					}
				};
	    	
	    	var n = {};
	    	for (var i = 0; i < d.length; i++) {

					var curDate = moment.unix(d[i].docDate / 1000).format("YYYY-MM-DD");
					d[i].d = curDate;

					if (!n[curDate]) {
						n[curDate] = [new Date(moment.unix(d[i].docDate / 1000)), 0, 0, 0, 0];
					}

					/*if (d[i].categoryCode)
						n[curDate][d[i].categoryCode] = d[i].cnt;*/
					// category_code 대신에 cId 사용
					if (d[i].cId)
						n[curDate][d[i].cId] = d[i].cnt;
				}

				var r = [], rCnt = 0;
				for (var el in n) r[rCnt++] = n[el];
				
				var cIds = ["뉴스", "SNS", "블로그", "기타"];

				var chnData = new google.visualization.DataTable();
				chnData.addColumn("date", "date");
		 		for (var i = 0; i < cIds.length; i++) {
		 			chnData.addColumn("number", cIds[i]);	
		 		}
		    chnData.addRows(r);

		    var chart = new google.visualization.LineChart(document.getElementById('chart_trend_sub_area'));
		    chart.draw(chnData, chartOpts);
	    }
		});

		//alert("Click Keyword : " + $(t).text());
	}

	function onRequestKwdNetwork(top3Kwd, date, cName) {

		$.ajax({
	    type: "post",
    	contentType: 'application/json; charset=utf-8',
		dataType: 'json',
	    url: "http://13.209.38.43:8080/bdp/report/get_kwd_asso",
	    data: JSON.stringify({
	    	kwd: top3Kwd, //"서울,은행장,태승",
	    	cnt: "10",
	    	date: date //$(".flatpickr input[name='date_to']").val()
	    }),

	    success: function (cName, top3Kwd, data) {
	      if (!data.isSuccess) {
	        alert("데이터 요청에 실패하였습니다.");
	        return;
	      }

	      new SDII.Chart.kwdNetwork().setData(data, cName, top3Kwd).onDrawChart();
				$("body, html").scrollTop(0);
	    }.bind(this, cName, top3Kwd),

	    error: function (request, status, error) {
		    console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
		    alert("데이터 요청에 실패하였습니다..");
		    return;
	  	}
		});
	}

	SDII.Globals.Func.onRequestKwdNetwork = onRequestKwdNetwork;

$(document).ready(function() {

	google.charts.load('current', {'packages': ['corechart', 'line', 'controls']});
	google.charts.setOnLoadCallback(function() {

		$.ajax({
	    type: "post",
    	contentType: 'application/json; charset=utf-8',
		dataType: 'json',
	    url: "http://13.209.38.43:8080/bdp/report/get_kwd_trd",
	    data: JSON.stringify({
	    	code: "03",
	    	period: "day",
	    	startDate: $(".flatpickr input[name='date_from']").val(),
	    	endDate: $(".flatpickr input[name='date_to']").val()
	    }),

	    success: function (data) {
	      if (!data.isSuccess) {
	        alert("데이터 요청에 실패하였습니다.");
	        return;
	      }
	      new SDII.Chart.trendChart().setData(data).onDrawChart();
	    },

	    error: function (request, status, error) {
		    console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
		    alert("데이터 요청에 실패하였습니다..");
		    return;
	  	}
		});
	});

	$(".pop_container").hide();
	$(".cus_container").hide();
	$(".daum_container").hide();

	$(".map_wrap").hide();
	$(".docs_smmry_wrap").hide();

	$(".chart_trend_sub_wrap").hide();

	$(".flatpickr").flatpickr({locale : "ko", wrap: true});

	$(".range_wrap .btn_range").on("click", function() {
		$(this).parent().find("div").removeClass("btn_range_click");
		$(this).addClass("btn_range_click");
	});

	$lastMon = new Date();
	$lastMon.setMonth($lastMon.getMonth() - 1);

	$(".flatpickr")[0]._flatpickr.setDate($lastMon);
	$(".flatpickr")[1]._flatpickr.setDate(new Date());
	

	$(".flatpickr")[0]._flatpickr.setDate(new Date(2018, 0, 1));
	$(".flatpickr")[1]._flatpickr.setDate(new Date(2018, 1, 1));
	
	
	$(".btn_range").click(function() {

		$curVal = $(this).attr("data-value");

		$fpkr    = $(".flatpickr");
		$curFrom = $fpkr[0]._flatpickr.input.value;
		$curTo   = $fpkr[1]._flatpickr.input.value;

		$cs      = $curFrom.split("-");
		$ts      = $curTo.split("-");

		if ($curVal == "day") {

			$newFrom = new Date($cs[0], $cs[1], 1);
			$newTo   = new Date($ts[0], $ts[1], 0);

		} else if ($curval == "week") {

		} else if ($curval == "mon") {

		} else if ($curval == "quarter") {

		} else if ($curVal == "year") {

		} else {
			console.log("INVALID CASE");
		}

		//$(".flatpickr")[0]._flatpickr.setDate($newFrom);
		//$(".flatpickr")[1]._flatpickr.setDate($newTo);
	});

	$(".chart_trend_sub_close").on("click", function() {
		$(this).parent().slideUp();
	});


	//$(".search_box_inp").val("삼성전자");
	$(".btn_search_box").on("click", function() {

		$(".main_container, .side_container").hide();
		$(".daum_container").show();

		var param = {
			kwd: $(".search_box_inp").val().trim(),
			startDate: $("input[name=date_from]").val(),
			endDate: $("input[name=date_to]").val(),
	    	period: "day"
			/*kwd: '신한은행',
			startDate: '2018-09-01',
			endDate: '2018-09-05'	*/
		};
		
		//1. 데이터 리퀘스트 후 함수호출
		$.ajax({
			url: 'http://13.209.38.43:8080/bdp/cus/get_trd',
			type: 'post',
        	contentType: 'application/json; charset=utf-8',
			dataType: 'json',
	    data: JSON.stringify(param),
        success: function(trendResult) {
        	if (!trendResult.isSuccess) {
        		alert("데이터 요청에 실패하였습니다.");
        		return;
        	}
        	new SDII.Chart.cusTrendChart().setData(trendResult).onDrawChart();
        }
		});
		
		//2. 데이터 얻기: 네트워크 차트+바차트
		$.ajax({
			url: 'http://13.209.38.43:8080/bdp/cus/get_kwd',
			type: 'post',
        	contentType: 'application/json; charset=utf-8',
			dataType: 'json',
	    data: JSON.stringify(param),
        success: function(kwdResult) {
        	if (!kwdResult.isSuccess) {
        		alert("데이터 요청에 실패하였습니다.");
        		return;
        	}
        	new SDII.Chart.cusKwdAssoNetwork().setData(kwdResult).onDrawChart();	        	
        	new SDII.Chart.cusKwdAssoChart().setData(kwdResult).onDrawChart();
        }
		});
		
		//3.데이터 얻기: 기간별 연관어 상위25개 테이블
		$.ajax({
			url: 'http://13.209.38.43:8080/bdp/cus/get_kwd_asso',
			type: 'post',
        	contentType: 'application/json; charset=utf-8',
			dataType: 'json',
	    data: JSON.stringify(param),
        success: function(kwdAssoTimeResult) {
        	if (!kwdAssoTimeResult.isSuccess) {
        		alert("데이터 요청에 실패하였습니다.");
        		return;
        	}
        	console.log(kwdAssoTimeResult);
        	new SDII.Chart.cusKwdAssoTimeTable().setData(kwdAssoTimeResult).onDrawChart();
        }
		});
		//new SDII.Chart.cusEmotionChart().setData().onDrawChart();
		//new SDII.Chart.cusMap().setData().onDrawChart();
	});

	function onDrawCard(res) {

		if (!res.isSuccess || res.data.length == 0) return;

		var d = res.data,
			  c = {};

		for (var i = 0; i < d.length; i++) {

			//var cateId = d[i].categoryCode;
			var cateId = d[i].cId;
			if (!cateId) continue;

			var parent = $("div[card-data-type=" + cateId + "]");
			if (parent.length == 0) continue;

			if (!c[cateId]) {
				parent.html("");
				c[cateId] = 0;
			}
			if (c[cateId] == 5) continue;

			var cursrc = d[i].scriptTitle;
			if (cursrc.length > 13) cursrc = d[i].scriptTitle.substr(0, 13) + "...";

			$a_tag = $("<span class='content_num'>" +  (i + 1) + ". </span><a class='src_title'>" + cursrc + "</a>");
			$a_tag.attr("data-container", "body")
			  .attr("data-trigger", "hover")
				.attr("data-toggle", "popover")
				.attr("data-placement", "right")
				.attr("data-content", d[i].scriptTitle)
				.attr("uuid", d[i].scriptUid);
			$a_tag.popover();

			c[cateId] += 1;

			$a_tag.on("click", function() {
				$(".news_wrap").hide();
				$(".map_wrap").hide();
				$(".docs_smmry_wrap").show();


				console.log($(this).attr("uuid"));

				if (!$(this).attr("uuid")) return;

				$.ajax({
					url: "http://13.209.38.43:8080/bdp/report/get_smmry_extv",
			    type: "post",
	        	contentType: 'application/json; charset=utf-8',
				dataType: 'json',
			    data: JSON.stringify({
			    	scriptUid: $(this).attr("uuid"),
			    	//date: "2018-09-05", //$(".flatpickr")[1]._flatpickr.input.value,
			    	date: $(".flatpickr")[1]._flatpickr.input.value,
			    	cnt : 10
			    }),
			   	success: function (data) {
			      if (!data.isSuccess) {
			        alert("데이터 요청에 실패하였습니다.");
			        return;
			      }
			      
			      if (!data.data || data.data.length == 0) {
			      	$(".docs_extv_cont").html("<div>조회된 결과가 없습니다.</div>");
			      	return;
			      }

			      $(".docs_extv_cont").html("");
			      $(".docs_smmry_wrap").scrollTop(0);

			      $(".docs_extv_result").text("검색결과 : " + data.data.length + "건");
			      var d = data.data;
			      for (var i = 0; i < d.length; i++) {
			      	
			      	$title = $("<div class='smmry_title'>" + d[i].scriptTitle	+ "</div>");
			      	$smmry = $("<div class='smmry_cont'>" + d[i].relDocSummary	+ "</div>");
			      	$url   = $("<div class='smmry_link' url='" + d[i].relDocUid + "'>[원문보기]</div>");
			      	$row   = $("<div class='smmry_row_wrap'></div>");

			      	$row.append($title).append($smmry).append($url);
			      	$(".docs_extv_cont").append($row);
			      }

			      $(".smmry_link").on("click", function() {
			      	window.open($(this).attr("url"), "", "width=1200,height=600");
			      });
			    },
			    error: function (request, status, error) {
			    	console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
				    alert("데이터 요청에 실패하였습니다..");
				    return;
			  	}
				});
			});

			parent.append($a_tag).append("<div class='content_bdr'></div>");
		}
	}

	$(".navibar_brand").on("click", function() {

		if ($(".main_container").attr("isOpen") == 1) {
			$(".side_container").attr("isOpen", 0).hide();
			$(".main_container").attr("isOpen", 0).hide();
			$(".map_container").attr("isOpen", 0).hide();
			$(".daum_container").attr("isOpen", 1).slideDown("fast");

		} else {
			$(".daum_container").attr("isOpen", 0).hide();
			$(".map_container").attr("isOpen", 0).hide();
			$(".side_container").attr("isOpen", 1).show();
			$(".main_container").attr("isOpen", 1).slideDown("fast");
		}
	});

	$(".side_card .title").on("click", function() {

		var cateNum = $(this).attr("card-cate-value");

		if (cateNum == 1) {
			$(".docs_smmry_wrap").attr("isOpen", 0).hide();
			$(".map_wrap").attr("isOpen", 0).hide();
			$(".daum_container").attr("isOpen", 0).hide();
			$(".news_wrap").attr("isOpen", 1).slideDown("fast");
		} else if (cateNum == 3) {
			$(".docs_smmry_wrap").attr("isOpen", 0).hide();
			$(".news_wrap").attr("isOpen", 0).hide();
			$(".daum_container").attr("isOpen", 0).hide();
			$(".map_wrap").attr("isOpen", 1).slideDown("fast");

			$.ajax({
         url: 'http://13.209.38.43:8080/bdp/cus/get_doc_loc',
         type: 'post',
     	contentType: 'application/json; charset=utf-8',
    	dataType: 'json',
          //data: param,
         
           success: function(mapDataset) {
              if (!mapDataset.isSuccess) {
                 alert("데이터 요청에 실패하였습니다.");
                 return;
              }
              console.log(mapDataset);
              new SDII.Chart.cusMap().setData(mapDataset).onDrawChart();
           }
      });
		}
	});

	$.ajax({
  	url: "http://13.209.38.43:8080/bdp/report/get_abs_src",
    type: "post",
	contentType: 'application/json; charset=utf-8',
	dataType: 'json',
    data: JSON.stringify({
    	//date: "2018-09-05", //$(".flatpickr")[1]._flatpickr.input.value,
    	date: $(".flatpickr")[1]._flatpickr.input.value,
    	cnt :5
    }),
   	success: function (data) {
      if (!data.isSuccess) {
        alert("데이터 요청에 실패하였습니다.");
        return;
      }
      onDrawCard(data);
    },
    error: function (request, status, error) {
    	console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
	    alert("데이터 요청에 실패하였습니다..");
	    return;
  	}
	});

/*
	
*/
});

})();
