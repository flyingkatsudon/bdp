package com.shinhan.vo;

import java.util.Date;

public class AssoKwdStdInfoVO {

	private String userId;
	private int userKwrdId;
	private String userKwrd;
	private String userKwrdTag;
	private int userKwrdCnt;
	private Long userKwrdWeight;
	private Date loadDate;
	private Date updateDate;
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public int getUserKwrdId() {
		return userKwrdId;
	}
	public void setUserKwrdId(int userKwrdId) {
		this.userKwrdId = userKwrdId;
	}
	public String getUserKwrd() {
		return userKwrd;
	}
	public void setUserKwrd(String userKwrd) {
		this.userKwrd = userKwrd;
	}
	public String getUserKwrdTag() {
		return userKwrdTag;
	}
	public void setUserKwrdTag(String userKwrdTag) {
		this.userKwrdTag = userKwrdTag;
	}
	public int getUserKwrdCnt() {
		return userKwrdCnt;
	}
	public void setUserKwrdCnt(int userKwrdCnt) {
		this.userKwrdCnt = userKwrdCnt;
	}
	public Long getUserKwrdWeight() {
		return userKwrdWeight;
	}
	public void setUserKwrdWeight(Long userKwrdWeight) {
		this.userKwrdWeight = userKwrdWeight;
	}
	public Date getLoadDate() {
		return loadDate;
	}
	public void setLoadDate(Date loadDate) {
		this.loadDate = loadDate;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
}
