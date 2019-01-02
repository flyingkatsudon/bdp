package com.shinhan.dao;

import java.util.ArrayList;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.shinhan.vo.ParamVO;

@Repository
public interface DocTableDAO {
	
	ArrayList<Object> getAbsScript(@Param("param") ParamVO param);

	// 금투 uid 리스트 
	ArrayList<String> getUidList(@Param("param") ParamVO param);
	//금투-종목브리핑-요약스크립트
	ArrayList<Object> getStockSmmryExtv(@Param("param") ParamVO param);
	
	ArrayList<Object> getSmmryExtv(@Param("param") ParamVO param);
	
	ArrayList<Object> getIsuStock(@Param("param") ParamVO param);
}
