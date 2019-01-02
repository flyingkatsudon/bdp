package org.cboard.services;

import javax.servlet.http.HttpServletRequest;

import org.cboard.dao.RoleDao;
import org.cboard.dao.UserDao;
import org.cboard.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.ModelAndView;

import com.google.common.base.Charsets;
import com.google.common.hash.Hashing;

@Repository
public class SDIIUserService implements AuthenticationService {

    @Autowired
	private HttpServletRequest request;
    
	@Autowired
	private RoleDao roleDao;
	
	@Autowired
	private UserDao userDao;
	
	public User getCurrentUser() {
		User curUser = (User) request.getSession().getAttribute("user");
		curUser.setUserPassword(null);
		return curUser;
	}
	
	public User getUser(User param){
		return loadUserByUsername(param);
	}

	public void updatePwd(User user) {
		userDao.updatePwd(user);
	}

	public void updateLoginCnt(User user) {
		userDao.updateLoginCnt(user);
	}
	
	public User loadUserByUsername(User param) throws UsernameNotFoundException {
		User user = new User();
		
		try {
			user = userDao.getUser(param);
			if (user != null) user.setResTypeList(userDao.getResTypeList(user.getRoleId()));
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

		return user;
	}

/*    public ModelAndView register(HttpServletRequest request, User user) {

		ModelAndView mav = new ModelAndView();
		
		User param = validate(user);
    	
		if (param.getUserId() != null) {
			User old = loadUserByUsername(param.getUserId());
			
			// 기존에 가입된 ID가 없으면 진행
			if (old == null) {

				// role_id가 등록되어 있으면 회원가입 진행
				if(roleDao.getRole(param.getRoleId()) == null) {
					request.setAttribute("msg", "Role dosen't exist");
					mav.setViewName("cboard/view/login/register.jsp");
				} else {
					param.setUserPassword(Hashing.md5().newHasher().putString(param.getUserPassword(), Charsets.UTF_8).hash().toString());
			    	userDao.register(param);
	
					request.setAttribute("msg", "Complete");
					mav.setViewName("login.jsp");
				}
			} else {
				request.setAttribute("msg", "Already exist");
				mav.setViewName("cboard/view/login/register.jsp");
			}
		} else {
			mav.setViewName("cboard/view/login/register.jsp");
		}
		
		return mav;
    }
    
	// user 객체 유효성 검사
    public User validate(User user) {
    	
    	User param = new User();
    	
    	param.setRoleId(user.getV0() + '-' + "00");
    	param.setBusinessCode(user.getV0());
    	
		String userId = user.getV1();

		if (userId.length() < 10) {
			
			int value = 10 - userId.length();
			for (int i = 0; i < value; i++) {
				userId = '0' + userId;
			}
			param.setUserId(userId);
		}

    	param.setUserPassword(user.getV2());
    	param.setUserName(user.getV3());
    	
    	return param;
    }*/
}
