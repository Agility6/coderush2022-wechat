import request from './request.js'
import analysisReq from './analysisReq'

export function getPosDetail(pid) {
	return request({
		url: '/getPosDetail',
		method: 'GET',
		data: { pid }
	})
}

export function getPosList(page = 1) {
	return request({
		url: '/getPosList',
		method: 'GET',
		data: { page }
	})
}

export function searchPos(key, location, page, filter) {
	console.log(filter)
	return request({
		url: '/searchPos',
		method: 'GET',
		data: { key, location, page, filter }
	})
}
export function getProvinceRank() {
	return analysisReq({
		url: '/AllProvince_Job_Servlet',
		method: 'GET'
	})
}

export function getRegionRank(obj) {
	return analysisReq({
		url: '/CountryJob_DayTop_Servlet',
		method: 'GET',
		data: obj
	})
}

export function getPosRank() {
	return analysisReq({
		url: '/CountryJob_DayTop_Servlet',
		method: 'GET',
		data: { position: 'other'}
	})
}

export function matchPos(filter) {
	return request({
		url: '/matchPos',
		method: 'GET',
		data: filter
	})
}

export function getCompare() {
	return request({
		url: '/getCompare',
		method: 'GET'
	})
}

export function posTrend(city) {
	return request({
		url: '/posTrend',
		method: 'GET',
		data: city
	})
}

export function getPosSalary(obj) {
	return analysisReq({
		url: '/Exp_Scalary_Servlet',
		method: 'GET',
		data: obj
	})
}

export function getEducation(obj) {
	console.log(obj)
	return analysisReq({
		url: '/EduInfo_Servlet',
		method: 'GET',
		data: obj
	})
}

export function getCompanySize(obj) {
	return analysisReq({
		url: '/CompanySize_Servlet',
		method: 'GET',
		data: obj
	})
}

export function getCompanyFinance(obj) {
	return analysisReq({
		url: '/CompanyFinance_Servlet',
		method: 'GET',
		data: obj
	})
}

export function getCountrySalary() {
	return analysisReq({
		url: '/country_salary',
		method: 'GET'
	})
}