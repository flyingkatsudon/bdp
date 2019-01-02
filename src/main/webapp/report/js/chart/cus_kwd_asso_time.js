$(document).ready(function() {
	
(function() {
	
	var cusKwdAssoTimeTable = function(cnt) {
		this.rowMax   = cnt || 10;
		this.tableMax = 5;
		this.dataSet  = {};
	};
	
	cusKwdAssoTimeTable.prototype = {

		setData: function(kwd_asso_time_data) {

			var row    = this.rowMax,
					col    = this.tableMax,
					t      = kwd_asso_time_data.data,
					newObj = {};

			for (var i = t.length - 1; i >= 0; i--) {
			  var nDate = moment(new Date(t[i].docDate)).format("YYYY-MM-DD");
			  if (!newObj[nDate]) newObj[nDate] = [];
			  newObj[nDate].push(t[i]);
			}
			this.dataSet = newObj;
			return this;
		},
		
		onDrawChart: function() {
			
			var that      = this,
					newObj    = that.dataSet,
					tableCnt  = Object.keys(newObj).length,
					drawCnt   = 0,
					row       = that.rowMax,
					tbCnt     = that.tableMax,
					tableRank = $("#tableRank");

			tableRank.html("<tr><th colspan='2'>Rank</th></tr>");

			for (var el in newObj) {

				if (drawCnt == tbCnt) break;
				var padCnt  = 0;
				var curList = newObj[el];
				var newList = curList.sort(function(a, b) { 
					return b['docCntBoth'] - a['docCntBoth'];
				});

				if (newList.length < row) {
					padCnt = row - newList.length;
					newList = newList.concat(new Array(padCnt).fill({dummy:true}));
				}

				var curChart = $("#table" + (6 - (drawCnt + 1))),
					  curWeek  = Math.ceil(moment(el).date() / 7),
					  curMont  = moment(el).month() + 1;

				curChart.append("<tr><th colspan='2' class='text-center'>" + curMont + "월 " + curWeek + "주차</th></tr>");

				for (var j = 0; j < row; j++) {

					var curRow = newList[j],
							kwd    = curRow.kwdB || "-",
							dCnt   = curRow.docCntBoth || "-";
					curChart.append("<tr row-idx=" + j + "><td class='title td1'>" + kwd + "</td><td class=''>" + dCnt + "</td></tr>");	

					if (drawCnt == 0)
						tableRank.append("<tr><td class='title text-center'>" + (j + 1) + "</td>");
				}

				drawCnt++;
			}

			$(".td1").on("click", function() {
				
				if (!$(this).parent().attr("row-idx")) return;

				var rowIdx = parseInt($(this).parent().attr("row-idx")) + 1,
						curKey = $(this).text();

				for (var i = 0 ; i < tbCnt; i ++) {
					var curChild = $("#table" + (i + 1)).children();
					for (var j = 1; j < curChild.length; j++) {
						$(curChild[j]).css("background-color", "#ffffff");
						if (curKey == $(curChild[j]).find(".td1").text())
							$(curChild[j]).css("background-color", "#91c7ae");
					}

					//var tgtRow = $(curChild.get(rowIdx));
					//if ($("td:first", tgtRow).text() == "-") continue;
					//tgtRow.css("background-color", "#91c7ae");
				}
			});
		}
	};
	
	window.SDII.Chart.cusKwdAssoTimeTable = window.SDII.Chart.cusKwdAssoTimeTable || cusKwdAssoTimeTable;
	
})(window);
});