package com.shinhan.biz.cus.trend;

import java.util.Map;

import com.shinhan.vo.ParamVO;

public interface CusTrendChart {

	// 다음레포트 트렌드차트 new
	public Map<String, Object> getTrendV2(ParamVO param);

	// 위치브리핑 (미사용)
	public Map<String, Object> getDocLoc(ParamVO param) throws Exception;
}
