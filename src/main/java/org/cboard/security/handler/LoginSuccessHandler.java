package org.cboard.security.handler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.cboard.dto.User;
import org.cboard.util.CheckPwd;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class LoginSuccessHandler implements AuthenticationSuccessHandler {

	private static final Logger logger = LoggerFactory.getLogger(LoginSuccessHandler.class);
	
	@Autowired
	private CheckPwd checkPwd;
	
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		User user = (User) authentication.getPrincipal();
		request.getSession().setAttribute("user", user);

		logger.info("{}", authentication);

		request.setAttribute("login", true);
		request.setAttribute("error", false);

		// 초기 비밀번호로 로그인된 경우
		String defPwd  = "init12345";
		String convPwd = checkPwd.passwordEncoder.encodePassword(defPwd, "").toUpperCase();
		
		String userPwd = user.getUserPassword();
		
		if (userPwd == null && userPwd.isEmpty()) {
			// 처리로직 추가
			response.sendRedirect("/");
		}

		if (userPwd.equals(convPwd))
			request.getSession().setAttribute("isInitPwd", true);
		else
			request.getSession().setAttribute("isInitPwd", false);
			
		request.getRequestDispatcher("/auth").forward(request, response);
	}
}
