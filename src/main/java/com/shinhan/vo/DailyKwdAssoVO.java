package com.shinhan.vo;

import java.util.Date;

public class DailyKwdAssoVO {
	
	private int rn = 0;
	private String kwdA;
	private String kwdB;
	private int freqBoth = 0;
	private int docCntBoth = 0;
	
	public int getDocCntBoth() {
		return docCntBoth;
	}
	public void setDocCntBoth(int docCntBoth) {
		this.docCntBoth = docCntBoth;
	}
	private Date docDate;
	private double corrValue = 0.0;
	private Date loadDate;
	private Date updateDate;
	
	private String categoryCode;
	private String cId;
	
	private String channel; 

	private String year;
	private String month;
	private String week;
	private String quarter;

	public String getYear() {
		return year;
	}
	public void setYear(String year) {
		this.year = year;
	}
	public String getMonth() {
		return month;
	}
	public void setMonth(String month) {
		this.month = month;
	}
	public String getWeek() {
		return week;
	}
	public void setWeek(String week) {
		this.week = week;
	}
	public String getQuarter() {
		return quarter;
	}
	public void setQuarter(String quarter) {
		this.quarter = quarter;
	}
	public String getChannel() {
		return channel;
	}
	public void setChannel(String channel) {
		this.channel = channel;
	}
	public int getRn() {
		return rn;
	}
	public void setRn(int rn) {
		this.rn = rn;
	}
	public String getKwdA() {
		return kwdA;
	}
	public void setKwdA(String kwdA) {
		this.kwdA = kwdA;
	}
	public String getKwdB() {
		return kwdB;
	}
	public void setKwdB(String kwdB) {
		this.kwdB = kwdB;
	}
	public int getFreqBoth() {
		return freqBoth;
	}
	public void setFreqBoth(int freqBoth) {
		this.freqBoth = freqBoth;
	}
	public Date getDocDate() {
		return docDate;
	}
	public void setDocDate(Date docDate) {
		this.docDate = docDate;
	}
	public double getCorrValue() {
		return corrValue;
	}
	public void setCorrValue(double corrValue) {
		this.corrValue = corrValue;
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
	public String getCategoryCode() {
		return categoryCode;
	}
	public void setCategoryCode(String categoryCode) {
		this.categoryCode = categoryCode;
	}
	public String getcId() {
		return cId;
	}
	public void setcId(String cId) {
		this.cId = cId;
	}
}
