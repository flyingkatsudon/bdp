package com.shinhan.vo;

import java.util.Date;

public class ScriptRelDocsVO {

	private String scriptUid = "";
	private String relDocUid = "";
	private Long relDocWeight;
	private int relDocRank;
	private Date loadDate;
	private Date updateDate;
	
	public String getScriptUid() {
		return scriptUid;
	}
	public void setScriptUid(String scriptUid) {
		this.scriptUid = scriptUid;
	}
	public String getRelDocUid() {
		return relDocUid;
	}
	public void setRelDocUid(String relDocUid) {
		this.relDocUid = relDocUid;
	}
	public Long getRelDocWeight() {
		return relDocWeight;
	}
	public void setRelDocWeight(Long relDocWeight) {
		this.relDocWeight = relDocWeight;
	}
	public int getRelDocRank() {
		return relDocRank;
	}
	public void setRelDocRank(int relDocRank) {
		this.relDocRank = relDocRank;
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
