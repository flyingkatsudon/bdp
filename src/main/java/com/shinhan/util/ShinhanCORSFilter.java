package com.shinhan.util;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

public class ShinhanCORSFilter implements Filter {

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		// TODO Auto-generated method stub
		/**
		 * Access-Control-Allow-Origin: 요청을 보내는 페이지의 출처 (*, 도메인)
		 * Access-Control-Allow-Methods: 요청을 허용하는 메소드(Default: GET, POST, HEAD)
		 * Access-Control-Max-Age: 클라이언트에서 pre-flight의 요청 결과를 저장할 시간 지정
		 * Access-Control-Allow-Headers: 요청을 허용하는 헤더
		 * */
		HttpServletResponse response = (HttpServletResponse) res;
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT");
		response.setHeader("Access-Control-Max-Age", "3600");
		response.setHeader("Access-Control-Allow-Headers", "x-requested-with, origin, content-type, accept");
		chain.doFilter(req, res);

	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

}
