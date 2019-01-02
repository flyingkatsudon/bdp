package com.shinhan.vo;

import java.util.Date;

public class ScriptRelDocsScriptKwrdsVO {
	
	private String scriptUid;
	private String scriptKwrd;
	private int scriptKwrdRank;
	private Date loadDate;
	private Date updateDate;
	
	public String getScriptUid() {
		return scriptUid;
	}
	public void setScriptUid(String scriptUid) {
		this.scriptUid = scriptUid;
	}
	public String getScriptKwrd() {
		return scriptKwrd;
	}
	public void setScriptKwrd(String scriptKwrd) {
		this.scriptKwrd = scriptKwrd;
	}
	public int getScriptKwrdRank() {
		return scriptKwrdRank;
	}
	public void setScriptKwrdRank(int scriptKwrdRank) {
		this.scriptKwrdRank = scriptKwrdRank;
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
