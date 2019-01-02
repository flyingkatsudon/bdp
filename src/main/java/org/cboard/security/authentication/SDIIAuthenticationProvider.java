package org.cboard.security.authentication;

import org.cboard.dto.User;
import org.cboard.services.SDIIUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class SDIIAuthenticationProvider implements AuthenticationProvider  {

	private static Logger logger = LoggerFactory.getLogger(SDIIAuthenticationProvider.class);
	
	@Autowired
	private SDIIUserService userService;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {

		logger.info("{}", authentication);

		if (authentication == null) throw new AuthenticationServiceException("올바르지 않은 접근입니다.");
		User user = (User) authentication.getPrincipal();
		
		if (user == null) throw new AuthenticationServiceException("올바르지 않은 접근입니다.");
		User load = userService.loadUserByUsername(user);
		
		// 1. load 실패하면 없는 유저 에러
		if (load == null) {
			throw new UsernameNotFoundException("시스템에 등록되어 있지 않은 사번이거나, 사번 또는 비밀번호를 잘못 입력하셨습니다");
		} else {
			if (load.getDelCd().toUpperCase().equals("X"))
				throw new AuthenticationServiceException("시스템에 등록되어 있지 않은 사번이거나, 사번 또는 비밀번호를 잘못 입력하셨습니다");
			// 차단된 사용자라면
			if (load.getUserStateInfo().equals("1") || load.getRbacPolicy() >= 5) {
				
				load.setRbacPolicy(5);
				load.setUserStateInfo("1");
				
				userService.updateLoginCnt(load);
				
				throw new AuthenticationServiceException("비밀번호가 5회이상 일치하지 않았습니다. 로그인이 차단됩니다.         시스템 관리자에게 요청해주세요.");
			}
			
			// 2. load와 auth의 비밀번호가 서로 같으면 같은 유저, 선택한 그룹사 코드가 일치
			if (user.getUserPassword().equals(load.getUserPassword().toUpperCase()) 
					&& user.getUserId().equals(load.getUserId())
					&& user.getBusinessCode().equals(load.getBusinessCode())) {
				
				// 로그인 성공 시, 실패 횟수, 차단 여부 기본값으로 설정
				user.setRbacPolicy(0);
				user.setUserStateInfo("0");
				
				userService.updateLoginCnt(user);
				
				return new SDIIAuthenticationToken(load, load.getAuthorities());
			}  
			else {
				// 3. 비밀번호가 서로 다르다면 틀린 비밀번호 에러
				// 3-1. 비밀번호 틀린 횟수 추가
				int failCnt = load.getRbacPolicy() + 1;
				String retnMsg = "비밀번호가 " + failCnt + "회이상 일치하지 않았습니다. 로그인이 차단됩니다.         시스템 관리자에게 요청해주세요.";
				load.setRbacPolicy(failCnt);
				userService.updateLoginCnt(load);
				load.setUserStateInfo("1");
				if (failCnt < 5) {
					retnMsg = "비밀번호가 " + failCnt + " 회 일치하지 않았습니다. 5회 이상 일치하지 않을 시 로그인이 차단됩니다";
					load.setUserStateInfo("0");
				} 
				throw new BadCredentialsException(retnMsg);
			}
		}
	}
	
	@Override
	public boolean supports(Class<?> authentication) {
		// TODO Auto-generated method stub
		return SDIIAuthenticationToken.class.isAssignableFrom(authentication);
	}
}
