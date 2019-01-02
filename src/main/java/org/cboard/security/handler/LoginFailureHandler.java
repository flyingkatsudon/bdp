package org.cboard.security.handler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class LoginFailureHandler implements AuthenticationFailureHandler {

	private static final Logger logger = LoggerFactory.getLogger(LoginFailureHandler.class);
	
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {

		logger.info("failureHandler -> {}", exception.getMessage());

		request.setAttribute("msg", exception.getMessage());
		request.setAttribute("login", false);
		request.setAttribute("error", true);
		
		request.getRequestDispatcher("/fail").forward(request, response);
	}
}
