package com.shinhan.ctrl.report;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.shinhan.biz.cus.kwd.CusKwdChart;
import com.shinhan.biz.cus.trend.CusTrendChart;
import com.shinhan.vo.ParamVO;

@Controller
@RequestMapping("/cus")
public class CustomReportCtrl {
	
	@Autowired
	private CusTrendChart cusTrendChart;
	
	@Autowired
	private CusKwdChart cusKwdChart;
	
	private static final Logger logger = LoggerFactory.getLogger(CustomReportCtrl.class);
	
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
			else param.setKwd(vo.getKwd());

			if (vo.getKwdA() == null) param.setKwdA(null);
			else param.setKwdA(vo.getKwdA());
			
			if (vo.getKwdB() == null) param.setKwdB(null);
			else param.setKwdB(vo.getKwdB());
			
			if (vo.getQuery() == null || vo.getQuery().equals("")) param.setQuery(null);
			else param.setQuery(vo.getQuery());
			
			if (vo.getDomainOpt() == null || vo.getDomainOpt().equals("")) param.setDomainOpt(null);
			else param.setDomainOpt(vo.getDomainOpt());
			
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
			}
			else {
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
		
		logger.info("jobId: " + param.getJobId());
		logger.info("cnt: " + param.getCnt());
		logger.info("date: " + param.getDate());
		logger.info("startDate: " + param.getStartDate());
		logger.info("endDate: " + param.getEndDate());
		logger.info("kwd: " + param.getKwd());
		logger.info("query: " + param.getQuery());
		logger.info("domainOpt: " + param.getDomainOpt());
		logger.info("categoryCode: " + param.getCategoryCode());
		logger.info("businessCode: " + param.getBusinessCode());
		logger.info("flag: " + param.getFlag());
		logger.info("fid: " + param.getFid() + "\n");
		
		return param;
	}

	/* NEW */

	// 위치브리핑(미사용)
	@RequestMapping("/get_doc_loc")
	@ResponseBody
	public Map<String, Object> getDocLoc(@RequestBody(required = false) ParamVO param) throws Exception {
		return cusTrendChart.getDocLoc(setParam(param));
	}

	// 다음레포트 트렌드차트
	@RequestMapping("/get_trd")
	@ResponseBody
	public Map<String, Object> getTrendV2(@RequestBody ParamVO param) throws ParseException {
		return cusTrendChart.getTrendV2(setParam(param));
	}
	
	// Bar 차트
	@RequestMapping("/get_kwd")
	@ResponseBody
	public Map<String, Object> getKwd(@RequestBody ParamVO param) throws ParseException {
		return cusKwdChart.getKwd(setParam(param));
	}

	// 키워드 네트워크
	@RequestMapping("/get_kwd_asso")
	@ResponseBody
	public Map<String, Object> getKwdAsso(@RequestBody ParamVO param) throws ParseException {
		return cusKwdChart.getKwdAsso(setParam(param));
	}
	
	// 주차별 키워드의 연관어 (다음레포트에서 가져옴)
	@RequestMapping("/get_kwd_asso_v2")
	@ResponseBody
	public Map<String, Object> getKwdAssoV2(@RequestBody ParamVO param) throws ParseException {
		return cusKwdChart.getKwdAssoV2(setParam(param));
	}
	
	// 세션정보
	@RequestMapping("/get_user_info")
	@ResponseBody
	public Map<String, Object> getUserInfo(HttpServletRequest request, HttpServletResponse response) {
		return cusKwdChart.getUserInfo(request.getSession());
	}
}
