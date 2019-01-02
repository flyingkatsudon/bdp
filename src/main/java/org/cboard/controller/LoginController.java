package org.cboard.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.cboard.dto.User;
import org.cboard.services.SDIIUserService;
import org.cboard.util.CheckPwd;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class LoginController {

	@Autowired
	private SDIIUserService userService;

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

	@Autowired
	private CheckPwd checkPwd;
	
	@RequestMapping(value = "/")
	public String login(HttpServletRequest request) {
		return "redirect:/login.jsp";
	}

	@RequestMapping(value = {"/fail", "/process"})
	public ModelAndView failMsg(HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView();
		mav.addObject("msg", request.getAttribute("msg"));
		mav.setViewName("login.jsp");
		return mav;
	}
	
	@RequestMapping(value = "/auth")
	public String auth(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Object o = request.getSession().getAttribute("isInitPwd");
		if (o == null) return "redirect:/logout";
		else return !((boolean) o) ? "redirect:/login.jsp" : "redirect:/changePwd.jsp"; 
	}

	/*@RequestMapping(value = "/signUp")
	public String signUp(HttpServletRequest request) {
		return "cboard/view/login/register.jsp";
	}

	@RequestMapping(value = "/register")
	public ModelAndView register(HttpServletRequest request, @ModelAttribute User user) {
		return userService.register(request, user);
	}*/

	@RequestMapping(value = "/starter")
	public String starter() {
		return "cboard/starter.jsp";
	}
	
	@RequestMapping(value = "/update")
	@ResponseBody
	public Map<String, Object> update(HttpServletRequest request, @RequestBody User user) {
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		/*// 영문 대소문자, 특수문자 포함 10~20자리
		Pattern pattern = Pattern.compile("/(?=.*[a-z])(?=.*[A-Z])(?=.*[#$^+=!*()@%&]).{10,20}$/");

        Matcher matcher = pattern.matcher(user.getUserPassword());
        boolean matches = matcher.matches();*/

		try {
			// 비밀번호 교체의 경우
			if (user != null && user.getOldUserPassword() != null) {
				request.setAttribute("changePwd", null);
				
	    		String encodedPw = checkPwd.passwordEncoder.encodePassword(user.getUserPassword(), "").toUpperCase();
	    		user.setUserPassword(encodedPw);
	    		
	    		// 변경하려는 비밀번호 = 초기 비밀번호
	    		if(encodedPw.equals(user.getOldUserPassword())){
	    			map.put("msg", "초기 비밀번호로 변경할 수 없습니다");
	    		} else {
	    			userService.updatePwd(user);
	    			map.put("msg", "변경이 완료되었습니다");
	    			map.put("location", "logout");
	    			
	    			return map;
	    		}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return map;
	}
}