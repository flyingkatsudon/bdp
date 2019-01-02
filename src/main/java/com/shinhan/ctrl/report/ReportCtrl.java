package com.shinhan.ctrl.report;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.shinhan.biz.insight.docs.DocTable;
import com.shinhan.biz.insight.kwd.KwdChart;
import com.shinhan.biz.insight.trend.TrendChart;
import com.shinhan.vo.ParamVO;

@Controller
@RequestMapping("/report")
public class ReportCtrl {

	@Autowired
	private DocTable docTable;

	@Autowired
	private TrendChart trendChart;

	@Autowired
	private KwdChart kwdChart;
	
	private static final Logger logger = LoggerFactory.getLogger(ReportCtrl.class);

	public ParamVO setParam(ParamVO vo) {

		ParamVO param = new ParamVO();
		
		if (vo != null) {
			if (vo.getCnt() == null || vo.getCnt().equals("")) param.setCnt(null);
			else param.setCnt(vo.getCnt());
			
			if (vo.getDate() == null || vo.getDate().equals("")) param.setDate(null);
			else param.setDate(vo.getDate());
			
			if (vo.getStartDate() == null || vo.getStartDate().equals("")) param.setStartDate(null);
			else param.setStartDate(vo.getStartDate());
			
			if (vo.getEndDate() == null || vo.getEndDate().equals("")) param.setEndDate(null);
			else param.setEndDate(vo.getEndDate());
			
			if (vo.getKwd() == null || vo.getKwd().equals("")) param.setKwd(null);
			else param.setKwd(vo.getKwd().trim());

			if (vo.getKwdA() == null) param.setKwdA(null);
			else param.setKwdA(vo.getKwdA().trim());
			
			if (vo.getKwdB() == null) param.setKwdB(null);
			else param.setKwdB(vo.getKwdB().trim());
			
			if (vo.getQuery() == null || vo.getQuery().equals("")) param.setQuery(null);
			else param.setQuery(vo.getQuery());
			
			if (vo.getDomainOpt() == null || vo.getDomainOpt().equals("")) param.setDomainOpt(null);
			else param.setDomainOpt(vo.getDomainOpt());
			
			if (vo.getNerInfoA() == null || vo.getNerInfoA().equals("")) param.setNerInfoA(null);
			else param.setNerInfoA(vo.getNerInfoA());
			/** 
			 * startDate, endDate 중 어느 하나만 있으면: 동일한 날짜
			 * 아무 값도 없다면: 오늘 날짜
			*/
			String defDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			String d  = param.getDate();
			String sd = param.getStartDate();
			String ed = param.getEndDate();
			
			if (d == null) {
				if (ed == null) {
					param.setDate(defDate);
					param.setEndDate(defDate);
				} else {
					param.setDate(ed);
				}
				d = param.getDate();
				ed = param.getEndDate();
			}
			
			if (sd != null && ed == null) param.setEndDate(sd);
			if (ed != null && sd == null) param.setStartDate(ed);

			if (vo.getBusinessCode() == null || vo.getBusinessCode().equals("")) param.setBusinessCode(null);
			else param.setBusinessCode(vo.getBusinessCode());
			
			// 조회 단위의 기본 값은 '일(00)'
			if (vo.getPeriod() == null || vo.getPeriod().equals("")) param.setPeriod("day");
			else param.setPeriod(vo.getPeriod());

			if (vo.getCategoryCode() == null || vo.getCategoryCode().equals("")) {
				param.setCategoryCode(null);
			} else {
				switch(vo.getCategoryCode()) {
				case "1":
					param.setCategoryCode("08201");
					break;
				case "2":
					param.setCategoryCode("08202");
					break;
				case "3":
					param.setCategoryCode("08203");
					break;
				case "4":
					param.setCategoryCode("08204");
					break;
				case "5":
					param.setCategoryCode("08205");
					break;
				default:
					param.setCategoryCode(null);
				}
			}
		}

		if(vo.getBusinessCode() == null || vo.getBusinessCode().equals("")) {
			param.setBusinessCode(null);	
		} else {
			param.setBusinessCode(vo.getBusinessCode());
		}
		
		if(vo.getScriptUid() == null || vo.getScriptUid().equals("")) {
			param.setScriptUid(null);
		} else {
			param.setScriptUid(vo.getScriptUid());
		}
		
		if (vo.getJobId() == null || vo.getJobId().equals("")) {
			param.setJobId(null);
		} else {
			param.setJobId(vo.getJobId());
		}
		
		if(vo.getFid() == null || vo.getFid().equals("")) {
			param.setFid(null);
		} else {
			param.setFid(vo.getFid());
		}
		
		if(vo.getFlag() == null || vo.getFlag().equals("")) {
			param.setFlag(null);
		} else {
			param.setFlag(vo.getFlag());
		}

		if(vo.getFidList() == null) {
			param.setFidList(null);
		} else {
			param.setFidList(vo.getFidList());
		}

		logger.info("jobId: " + param.getJobId());
		logger.info("cnt: " + param.getCnt());
		logger.info("date: " + param.getDate());
		logger.info("startDate: " + param.getStartDate());
		logger.info("endDate: " + param.getEndDate());
		logger.info("kwd: " + param.getKwd());
		logger.info("kwdA: " + param.getKwdA());
		logger.info("query: " + param.getQuery());
		logger.info("domainOpt: " + param.getDomainOpt());
		logger.info("categoryCode: " + param.getCategoryCode());
		logger.info("businessCode: " + param.getBusinessCode());
		logger.info("flag: " + param.getFlag());
		logger.info("fid: " + param.getFid());
		logger.info("nerInfoA: " + param.getNerInfoA());
		
		if (param.getFidList() != null)
			logger.info("fidList: " + param.getFidList().get(0) + "\n");
		
		return param;
	}

	/* NEW */
	// 요약 스크립트
	@RequestMapping(value = "/get_abs_src")
	@ResponseBody
	public Map<String, Object> getAbsScript(@RequestBody ParamVO param) throws ParseException {
		return docTable.getAbsScript(setParam(param));
	}
	
	// 요약문 목록 및 원문보기
	@RequestMapping(value = "/get_smmry_extv")
	@ResponseBody
	public Map<String, Object> getSmmryExtv(@RequestBody ParamVO param) {
		return docTable.getSmmryExtv(setParam(param));
	}
	
	// 트렌드차트
	@RequestMapping(value = "/get_kwd_trd_v2")
	@ResponseBody
	public Map<String, Object> getKwdTrendV2(@RequestBody ParamVO param) throws ParseException {
		
		// 금투-연관종목
		ArrayList<String> fidList = new ArrayList<String>(); // 키워드 리스트 String을 list로 구분하여 저장
		if(param.getFid() != null && param.getFid().contains(",")) { // fid에 콤마가 포함이면
			String[] arr = param.getFid().split(","); // 파싱
	
			for (int i = 0; i < arr.length; i++) {
				fidList.add(arr[i].trim());
			}
	
			param.setFidList(fidList);
		}
		
		// fid가 여러개 들어왔을 때
		if (fidList.contains("BDPC04030305")) return trendChart.getRelStock(setParam(param));
		return trendChart.getKwdTrendV2(setParam(param));
	}
	
	// 채널별 확산
	@RequestMapping(value = "/get_trd_v2")
	@ResponseBody
	public Map<String, Object> getTrendV2(@RequestBody ParamVO param) throws ParseException {
		// 시장브리핑 - 코스피/코스닥 지수추이
		if(param.getFid().equals("BDPC04030205")) {
			return trendChart.getMarketTrend(setParam(param));
		} else {
			return trendChart.getTrendV2(setParam(param));
		}
	}

	// 시장브리핑 - 코스피/코스닥 지수추이
	@RequestMapping(value = "/get_market_trd")
	@ResponseBody
	public Map<String, Object> getMarketTrend(@RequestBody ParamVO param) throws ParseException {
		// 시장브리핑 - 코스피/코스닥 지수추이
		if(param.getFid().equals("BDPC04030205")) {
			return trendChart.getMarketTrend(setParam(param));
		} else {
			return trendChart.getTrendV2(setParam(param));
		}
	}
		
	// 기간별 연관어 차트
	@RequestMapping(value = "/get_kwd_asso")
	@ResponseBody
	public Map<String, Object> getKwdAsso(@RequestBody ParamVO param) throws ParseException {
		return kwdChart.getKwdAsso(setParam(param));
	}
	
	// 주차별 연관어 차트
	@RequestMapping("/get_kwd_asso_v2")
	@ResponseBody
	public Map<String, Object> getKwdAssoV2(@RequestBody ParamVO param) throws ParseException {
		return kwdChart.getKwdAssoV2(setParam(param));
	}

	// 긍부정차트
	@RequestMapping("/get_emo_asso")
	@ResponseBody
	public Map<String, Object> getEmoAsso(@RequestBody ParamVO param) throws Throwable {
		return kwdChart.getEmoAsso(setParam(param));
	}
	
	// 금투-종목검색
	@RequestMapping("/get_stock_info")
	@ResponseBody
	public Map<String, Object> getStockInfo(@RequestBody ParamVO param) throws Throwable {
		return trendChart.getStockInfo(setParam(param));
	}
	
	// 금투-공시
	@RequestMapping("/get_disclosure_info")
	@ResponseBody
	public Map<String, Object> getDisclosureInfo(@RequestBody ParamVO param) throws Throwable {
		return kwdChart.getDisclosureInfo(setParam(param));
	}
	
	// 금투 - 전문가 의견
	@RequestMapping("/get_expert_opinion")
	@ResponseBody
	public Map<String, Object> getExpertOpinion(@RequestBody ParamVO param) throws Throwable {
		return kwdChart.getExpertOpinion(setParam(param));
	}

	/* 검색엔진 사용 */
	// 키워드 네트워크 원문조회
	@RequestMapping("/get_full_src")
	@ResponseBody
	public Map<String, Object> getFullSrc(@RequestBody ParamVO param) throws Throwable {
		return docTable.getFullSrc(setParam(param));
	}
}