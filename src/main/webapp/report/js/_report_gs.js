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

	sf.onDrawTrendChart = function() {

		$.ajax({
	    type: "post",
    	contentType: 'application/json; charset=utf-8',
			dataType: 'json',
	    url: SDII.Url + "/report/get_kwd_trd_v2",
	    data: JSON.stringify({
	    	businessCode: sv.groupCd,
	    	categoryCode: sv.category, 
	    	period      : sv.period,
	    	startDate   : $(".flatpickr input[name='date_from']").val(),
	    	endDate     : $(".flatpickr input[name='date_to']").val()
	    }),

	    success: function (data) {

	      if (!data.isSuccess) {
	        alert("데이터 요청에 실패하였습니다.");
	        return;
	      }

	      new SDII.Chart.trendChart().setData(data).onDrawChart();
	      SDII.Globals.Vars.searchEnable = true;
	    },

	    error: function (request, status, error) {
		    console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
		    alert("데이터 요청에 실패하였습니다..");
		    return;
	  	}
		});
	}

	sf.onReqAbsScrpt = function() {
		$.ajax({
	  	url: SDII.Url + "/report/get_abs_src",
	    type: "post",
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
	    data: JSON.stringify({
	    	//date: "2018-09-05", //$(".flatpickr")[1]._flatpickr.input.value,
	    	businessCode: sv.groupCd,
	    	date: $(".flatpickr")[1]._flatpickr.input.value,
	    	cnt : 5
	    }),
	   	success: function (data) {
	      if (!data.isSuccess) {
	        alert("데이터 요청에 실패하였습니다.");
	        return;
	      }
	      sf.onDrawCard(data);
	    },
	    error: function (request, status, error) {
	    	console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
		    alert("데이터 요청에 실패하였습니다..");
		    return;
	  	}
		});
	}
	SDII.Globals.Func.getTrendLoadingText = function() {

		$prefix = sv.category == "1" ? "NEWS" : "시장";
		if (sv.category == "5") $prefix = "종목";

		return $prefix + " Trend 조회중 입니다.";
	}

	window.channelAction = function(t, p, d) {

		if (!sv.searchEnable) {
			return;
		}

		$(".chart_trend_sub_wrap").slideDown();

		$("#chart_trend_sub").html("<div class='chart_trend_sub_title'>" + p + " " + t + "에 대한 채널별 확산 조회중입니다.</div>");

		sv.searchEnable = false;

		$frmDate = moment(d);
		$toDate  = moment($("input[name=date_to]").val());
		$gapDate = ($toDate - $frmDate) / 1000;

		if ($gapDate < 604800)
			$frmDate = $toDate.clone().subtract(7, "days");

		$.ajax({

			url: SDII.Url + "/report/get_trd_v2",
			type: 'post',
    	contentType: 'application/json; charset=utf-8',
			dataType: 'json',
	    data: JSON.stringify({
				kwdA: p,
				kwdB: t,
				startDate: $frmDate.format("YYYY-MM-DD"),
				endDate: $toDate.format("YYYY-MM-DD"),
	    	period: "day"
	    }),
	    success: function(trendResult) {

	    	$("#chart_trend_sub").html("");
	    	if (!trendResult.isSuccess) {

	    		$(".chart_trend_sub_wrap").slideUp("fast");
	    		$("#chart_trend_sub").html("");
	    		alert("데이터 요청에 실패하였습니다.");
	    		return;
	    	}
	    	
	    	if (!trendResult.data || trendResult.data.length == 0) {
	    		alert(p + " " + t + "에 대한 채널별 검색 결과가 존재하지 않습니다.");
	    		$(".chart_trend_sub_wrap").slideUp("fast");
	    		$("#chart_trend_sub").html("");
	    		sv.searchEnable = true;
	    		return;
	    	}
	    	

				var fmt = "YYYY-MM-dd";

				//if (SDII.Globals.Vars.period == "mon") fmt = "YYYY-MM"

				var d = trendResult.data;

				var chartOpts = {
					//selectionMode: "multiple",
					aggregationTarget: "category",
			  	lineWidth: 1,
					pointSize: 2,
			    pointShape: 'circle',
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
						trigger: "selection"
					},
			    curveType: 'function',
			    legend: {
			    	position: "top",
			    	alignment: "end"
			    },
			    hAxis: {
			    	 gridlines: {
			      	color:  "none"
			      },
			    	format: fmt
			    },
			    vAxis: { 
			      //viewWindowMode:'maximized',
			      //textPosition: "none",
			      viewWindow:{
			      	//max:55,
			        min: 0
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
					/*
			    crosshair: {
			    	color: '#bbb',
			    	opacity: 1,
		 				trigger: 'both',
		        orientation: 'both'
					}
					*/
				};
	    	
	    	var n = {}; var maxCnt = 10;

	    	for (var i = 0; i < d.length; i++) {

					var curDate = moment.unix(d[i].docDate / 1000).format(fmt);
					d[i].d = curDate;

					if (!n[curDate]) {
						n[curDate] = [new Date(moment.unix(d[i].docDate / 1000)), 0, 0, 0];
					}

					n[curDate][trendResult.cnames.indexOf(d[i].cId) + 1] = d[i].docCntBoth;

					maxCnt = maxCnt < d[i].docCntBoth ? d[i].docCntBoth : maxCnt;
				}

				chartOpts.vAxis.viewWindow.max = maxCnt * 1.2;

				var r = [], rCnt = 0;
				for (var el in n) r[rCnt++] = n[el];
				
				var cIds = trendResult.cnames;

				var chnData = new google.visualization.DataTable();
				chnData.addColumn("date", "date");
		 		for (var i = 0; i < cIds.length; i++) {
		 			chnData.addColumn("number", cIds[i]);	
		 		}
		    chnData.addRows(r);

		    $("#chart_trend_sub").html("");
				$("#chart_trend_sub").append("<div class='chart_trend_sub_title'>채널별 검색키워드 : " + p + "/" + t + "</div>");
				$("#chart_trend_sub").append("<div id='chart_trend_sub_area'></div>");

		    var chart = new google.visualization.LineChart(document.getElementById('chart_trend_sub_area'));
		    chart.draw(chnData, chartOpts);

		    sv.searchEnable = true;
	    },

	    error: function (request, status, error) {
	    	sv.searchEnable = true;
	    }
		});

		//alert("Click Keyword : " + $(t).text());
	}

	function onRequestKwdNetwork(top3Kwd, date, cName) {
		
		$(".chart_doc_list").html("<div class='doc_search_title'>좌측 키워드 네트워크 차트에서 키워드를 선택 해주세요.</div>");

		$.ajax({
	    type: "post",
    	contentType: 'application/json; charset=utf-8',
			dataType: 'json',
	    url: SDII.Url + "/report/get_kwd_asso",
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

	      if (data.data.length == 0) {
	      	$("#chart_network_title").text("'" + top3Kwd + "'에 대한 연관어를 찾을 수 없습니다.");
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

	sf.onRequestKwdNetwork = onRequestKwdNetwork;

$(document).ready(function() {

	google.charts.load('current', {'packages': ['corechart', 'line', 'controls']});
	google.charts.setOnLoadCallback(SDII.Globals.Func.onDrawTrendChart);

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
	

	$(".flatpickr")[0]._flatpickr.setDate(new Date(2018, 8, 1));
	$(".flatpickr")[1]._flatpickr.setDate(new Date(2018, 9, 15));
	
	
	$(".btn_range").click(function() {

		$curVal = $(this).attr("data-value");

		if ($curVal == "day")          sv.period = "day";
		else if ($curVal == "week")    sv.period = "week";
		else if ($curVal == "mon")     sv.period = "mon";
		else if ($curVal == "quarter") sv.period = "quarter";
		else if ($curVal == "year")    sv.period = "year";

		console.log("Selected Peried : " + sv.period);
	});

	$(".chart_trend_sub_close").on("click", function() {
		$(this).parent().slideUp();
	});

	sf.onDrawCard = function (res) {

		$("div[card-data-type='1']").html("데이터가 없습니다.");
		$("div[card-data-type='2']").html("데이터가 없습니다.");
		$("div[card-data-type='6']").html("데이터가 없습니다.");

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
			if (cursrc.length > 13) cursrc = d[i].scriptTitle.substr(0, 12) + "...";

			$a_tag = $("<span class='content_num'>" +  d[i].cnt + " </span><a class='src_title'>" + cursrc + "</a>");
			$a_tag.attr("data-container", "body")
			  .attr("data-trigger", "hover")
				.attr("data-toggle", "popover")
				.attr("data-placement", "right")
				.attr("data-cid", d[i].cId)
				.attr("data-content", d[i].scriptTitle)
				.attr("uuid", d[i].scriptUid);
			$a_tag.popover();

			//console.log(d[i].cnt + " : " + d[i].scriptUid);

			c[cateId] += 1;

			$a_tag.on("click", function() {

				if (!$(this).attr("uuid")) return;

				$(".control_bar_show_wrap").slideUp();

				$(".news_wrap").hide();
				$(".docs_smmry_wrap").show();
				$(".docs_extv_result").html("'" + $(this).attr("data-content") + "'에 대해 조회중 입니다. 잠시만 기다려주세요.");
				$(".docs_extv_cont").html("");

				$.ajax({
					url: SDII.Url + "/report/get_smmry_extv",
			    type: "post",
	        	contentType: 'application/json; charset=utf-8',
						dataType: 'json',
			    	data: JSON.stringify({
				    	scriptUid: $(this).attr("uuid"),
				    	categoryCode: $(this).attr("data-cid"),
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
			      $(".docs_extv_result").text("검색결과 : " + data.data.length + "건 / 조회기준일 : " + $(".flatpickr")[1]._flatpickr.input.value);

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
		sv.category = cateNum;

		$(".control_bar_show_wrap").slideDown();
		
		$(".docs_smmry_wrap").attr("isOpen", 0).hide();
		$(".map_wrap").attr("isOpen", 0).hide();
		$(".daum_container").attr("isOpen", 0).hide();
		$(".news_wrap").attr("isOpen", 1).slideDown("fast");

		$prefix = cateNum == "1" ? "NEWS" : "시장";
		if (sv.category == "5") $prefix = "종목";

		$(".dashboard_trend_title").text($prefix + "브리핑");
		$("#chart_trend").html(sf.getTrendLoadingText());
		$("#ctrl_trend").html("");

		sv.period   = "day";
		sv.category = cateNum;
		sf.onDrawTrendChart();
		
	});

	sf.onReqAbsScrpt();

/*
*/

	$(".side_container_btn").on("click", function() {

		var isOpen = $(".side_container").attr("isOpen");

		if (isOpen == "1") {
			$(".side_container").animate({width: "toggle", opacity: 0}, 200).delay(200);		
			$(".side_container").attr("isOpen", "0");
			$(this).text(">");
		} else {
			$(".side_container").animate({width: "toggle", opacity: 1}, 200).delay(200);		
			$(".side_container").attr("isOpen", "1");
			$(this).text("<");
		}
	});

	$(".control_search_btn").on("click", function() {

		if (!sv.searchEnable) {
			alert("현재 데이터 조회중입니다. 잠시만 기다려주세요.");
			return;
		}

		$(".docs_smmry_wrap").hide();
		$(".news_wrap").show();

		$("#chart_trend").html(sf.getTrendLoadingText());
		$("#ctrl_trend").html("");
		$(".chart_trend_sub_close").click();

		sf.onReqAbsScrpt();
		sf.onDrawTrendChart();
	});

	$(".trend_report_btn").on("click", function() {
		var from = $(".flatpickr input[name='date_from']").val();
		var to   = $(".flatpickr input[name='date_to']").val();
		location.href = SDII.rdUrl + "/report/cus.html?from=" + from + "&to=" + to;
	});

	$(".navibar_group_title").on("click", function() {

		var from = $(".flatpickr input[name='date_from']").val();
		var to   = $(".flatpickr input[name='date_to']").val();

		$tgt = $(this).attr("link-target");

		if (!$tgt) return;

		location.href = SDII.rdUrl + "/report/" + $tgt + ".html";

		/*
		if ($tgt == "lc")
			location.href = SDII.rdUrl + "/report/cus.html?from=" + from + "&to=" + to;
		else 
			location.href = SDII.rdUrl + "/report/" + $tgt + ".html";
		*/
	});

	$(".navibar_menu").on("click", function() {
		location.href = "/bdp/cbaord/starter.jsp";
	});
});

})();
