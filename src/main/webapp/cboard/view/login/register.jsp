<%@page import="java.util.ArrayList"%>
<%@page import="org.cboard.pojo.DashboardRole"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Shinhan | BDP</title>
<!-- Tell the browser to be responsive to screen width -->
<meta
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
	name="viewport">
<link rel="stylesheet" href="cboard/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="cboard/css/font-awesome.min.css">
<link rel="stylesheet" href="cboard/css/ionicons.min.css">
<link rel="stylesheet" href="cboard/dist/css/AdminLTE.css">
<!-- iCheck -->
<link rel="stylesheet" href="cboard/plugins/iCheck/square/blue.css">


<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script>

$(document).ready(function(){
	
	$('#signUp').click(function(){
		
		var businessCode = $("select[name=v0]").val();
		
		var param = {
				businessCode: $("select[name=v0]").val(),
				userId: $("input[name=v1]").val(),
				userPassword: $("input[name=v2]").val(),
				userName: $("input[name=v3]").val()
		}
		
		return validate(param);
	});
	
	var validate = function(param) {

		var digits = 6;
		
		if (param.businessCode != null){
			switch(param.businessCode) {
			case "SH":
				digits = 8;
				break;
			case "LC":
				digits = 6;
				break;
			case "GS":
				digits = 6;
				break;
			case "SL":
				digits = 7;
				break;
			default:
				digits = 6;
			}
		}
		
		/* if (param.userId == 'undefined' || param.userId == '' || param.userId.length != digits) {
			$('#msg').html('<h5>사번 ' + digits + '자리를 확인하세요</h5>');
			return false;
		} */
		
		if (param.userId == 'undefined' || param.userId == '' || param.userId.length > 10) {
			$('#msg').html('<h5>사번을 확인하세요 (최대 10자리)</h5>');
			return false;
		}
		
		if (param.userPassword == 'undefined' || param.userPassword == '') {
			$('#msg').html('<h5>비밀번호를 확인하세요</h5>');
			return false;
		}

		if (param.userName == 'undefined' || param.userName == '') {
			$('#msg').html('<h5>이름을 확인하세요</h5>');
			return false;
		}
		
		return true;
	}
});

</script>

</head>
<%
	String msg = (String) request.getAttribute("msg");
%>
<body class="hold-transition login-page">
	<div class="login-box">
		<div class="login-logo">
			<% if (msg == null) { %>
			<span><b>Shinhan</b></span>&nbsp;|&nbsp;<span>BDP</span>
			<% } else { %>
			<span><b><%=msg%></b></span>
			<% } %>
		</div>
		<!-- /.login-logo -->
		<div class="login-box-body">
			<p class="login-box-msg"><span id="msg">To sign up, fill in the blank</span></p>

			<form action="/bdp/register" method="post" modelAttribute="User">
				<div class="form-group has-feedback">
					<select class="form-control" name="v0">
						<option value="SH">신한은행</option>
						<option value="LC">신한카드</option>
						<option value="GS">신한금융투자</option>
						<option value="SL">신한생명</option>
					</select>
				</div>
				<div class="form-group has-feedback">
					<input type="text" class="form-control" placeholder="사&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;번" id="v1" name="v1"> 
					<span class="glyphicon glyphicon-user form-control-feedback"></span>
				</div>
				<div class="form-group has-feedback">
					<input type="password" class="form-control" placeholder="비밀번호" id="v2" name="v2" autocomplete="new-password"> 
					<span class="glyphicon glyphicon-lock form-control-feedback"></span>
				</div>
				<div class="form-group has-feedback">
					<input type="text" class="form-control" placeholder="이&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;름" id="v3" name="v3"> 
					<span class="glyphicon glyphicon-user form-control-feedback"></span>
				</div>
				<!-- <div class="form-group has-feedback">
					<input type="text" class="form-control" placeholder="Email" name="v3"> 
					<span class="glyphicon glyphicon-user form-control-feedback"></span>
				</div> -->
				<%-- <div class="form-group has-feedback">
					<select class="form-control" name="v4">
					<% for(DashboardRole role : roleList){ %>		
						<option value=<%=role.getRoleName() %>><%=role.getRoleName() %></option>
					<% } %>
					</select>
				</div> --%>
				<div class="row">
					<!-- /.col -->
					<div class="col-xs-6">
						<a href="/bdp" class="btn btn-primary btn-block btn-flat" />Back</a>
					</div>
					<div class="col-xs-6">
						<button id="signUp" type="submit" class="btn btn-primary btn-block btn-flat">
							Sign Up</button>
					</div>
					<!-- /.col -->
				</div>
			</form>
		</div>
		<!-- /.login-box-body -->
	</div>
	<!-- /.login-box -->

	<!-- jQuery 2.2.3 -->
	<script src="cboard/plugins/jQuery/jquery-2.2.3.min.js"></script>
	<!-- Bootstrap 3.3.6 -->
	<script src="cboard/bootstrap/js/bootstrap.min.js"></script>
	<!-- iCheck -->
	<script src="cboard/plugins/iCheck/icheck.min.js"></script>
	<script>
  $(function () {
    $('input').iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
      increaseArea: '20%' // optional
    });
  });
</script>
</body>
</html>
