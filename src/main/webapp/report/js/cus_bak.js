(function() {
$(".daum_container").hide();


window.onProcess = function(from, to) {

	console.log(from, to);

	$inpText = $(".search_box_inp").val();

	if ($inpText == "" || $inpText.length < 2) {
		alert("검색어를 2글자이상 입력해주세요.");
		return;
	}

	$(".daum_container").show();
	$(".daum_container_title").html("로딩중입니다");
	$(".cus_kwd_asso_time_table_title").html("로딩중입니다");
	$(".cus_network_chart_title").html("로딩중입니다");
 	$(".cus_bar_chart_title").html("로딩중입니다");

	var param = {
		kwd: $(".search_box_inp").val().trim(),
		startDate: from,//$("input[name=date_from]").val(),
		endDate: to,//$("input[name=date_to]").val(),
    eriod: "day"
	};
	
	//1. 데이터 리퀘스트 후 함수호출
	$.ajax({
		url: 'http://13.209.38.43:8080/report/cus/get_trd',
		type: 'post',
    contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify({
			kwd: $(".search_box_inp").val().trim(),
			startDate: from,
			endDate: to,
			period: "day"
		}),
		success: function(trendResult) {
	  	if (!trendResult.isSuccess) {
	  		alert("데이터 요청에 실패하였습니다.");
	  		return;
	  	}
	  	
	  	$(".daum_container_title").html("\""+$(".search_box_inp").val().trim()+"\" 일별 언급량");
	  	new SDII.Chart.cusTrendChart().setData(trendResult).onDrawChart();
    }
	});
	
	//2. 데이터 얻기: 네트워크 차트+바차트
	$.ajax({
		url: 'http://13.209.38.43:8080/report/cus/get_kwd',
		type: 'post',
  	contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify(param),
		success: function(kwdResult) {
	  	if (!kwdResult.isSuccess) {
	  		alert("데이터 요청에 실패하였습니다.");
	  		return;
	  	}
	  	
	  	$(".cus_network_chart_title").html("\""+$(".search_box_inp").val().trim()+"\" 연관어 네트워크");
	  	$(".cus_bar_chart_title").html("\""+$(".search_box_inp").val().trim()+"\" 연관어 동시출현빈도수");
	  	
	  	new SDII.Chart.cusKwdAssoNetwork().setData(kwdResult).onDrawChart();	        	
	  	new SDII.Chart.cusKwdAssoChart().setData(kwdResult).onDrawChart();
	  	$('#myScroll').css('overflow', 'hidden');
    }
	});
	
	//3.데이터 얻기: 기간별 연관어 상위25개 테이블
	$.ajax({
		url: 'http://13.209.38.43:8080/report/cus/get_kwd_asso',
		type: 'post',
  	contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify(param),
		success: function(kwdAssoTimeResult) {
	  	if (!kwdAssoTimeResult.isSuccess) {
	  		alert("데이터 요청에 실패하였습니다.");
	  		return;
	  	}
	  	
	  	$(".cus_kwd_asso_time_table_title").html("\""+$(".search_box_inp").val().trim()+"\" 연관어 기간별 TOP25");
	  	new SDII.Chart.cusKwdAssoTimeTable().setData(kwdAssoTimeResult).onDrawChart();
    }
	});
}

$(document).ready(function() {

	function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	var from = getUrlParameter("from") || "2018-09-01";
	var to   = getUrlParameter("to")   || "2018-10-31";

	$(".btn_search_box").on("click", onProcess.bind(this, from, to));
	$(".search_box_inp ").on("keydown", function() {
		if (event.keyCode == 13) { onProcess(from, to); return;}
	});
	
	$(".btn_insight_report").on("click", function() {
		history.back(-1);
	});

	$(".search_box_inp").val("신한카드");
	onProcess(from, to);

}); //document ready end

})(); //function end
