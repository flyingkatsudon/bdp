package com.shinhan.vo;

import java.util.Date;

public class AssoKwdDetlInfoVO {

	private String userId;
	private int userKwrdId;
	private String userRelKwrd;
	private String userRelKwrdTag;
	private int userRelKwrdCnt;
	private int userRelKwrdRank;
	private Long userRelKwrdWeight;
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
	public String getUserRelKwrd() {
		return userRelKwrd;
	}
	public void setUserRelKwrd(String userRelKwrd) {
		this.userRelKwrd = userRelKwrd;
	}
	public String getUserRelKwrdTag() {
		return userRelKwrdTag;
	}
	public void setUserRelKwrdTag(String userRelKwrdTag) {
		this.userRelKwrdTag = userRelKwrdTag;
	}
	public int getUserRelKwrdCnt() {
		return userRelKwrdCnt;
	}
	public void setUserRelKwrdCnt(int userRelKwrdCnt) {
		this.userRelKwrdCnt = userRelKwrdCnt;
	}
	public int getUserRelKwrdRank() {
		return userRelKwrdRank;
	}
	public void setUserRelKwrdRank(int userRelKwrdRank) {
		this.userRelKwrdRank = userRelKwrdRank;
	}
	public Long getUserRelKwrdWeight() {
		return userRelKwrdWeight;
	}
	public void setUserRelKwrdWeight(Long userRelKwrdWeight) {
		this.userRelKwrdWeight = userRelKwrdWeight;
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
