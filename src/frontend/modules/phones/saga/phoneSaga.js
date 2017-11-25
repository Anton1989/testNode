import { GET_PHONES, CREATE_PHONE, SUCCESS, ADD_SUCCESS, ERROR, DELETE_PHONE, DELETE_SUCCESS } from '../constants';
import fetch from 'isomorphic-fetch';
// import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaPhones() {
	yield takeEvery(GET_PHONES, getPhones);
	yield takeEvery(CREATE_PHONE, createPhone);
	yield takeEvery(DELETE_PHONE, deletePhone);
}

/* middlewares */
function* getPhones(/* action */) {
	try {
		const phones = yield call(queryGetPhones);
		yield put({type: SUCCESS, phones});
	} catch (e) {
		yield put({type: ERROR, message: e.message});
	}
}
function* deletePhone(action) {
	try {
		if (yield call(queryDeletePhone, action.id)) {
			yield put({type: DELETE_SUCCESS, id: action.id});
		} else {
			yield put({type: ERROR});
		}
	} catch (e) {
		yield put({type: ERROR, message: e.message});
	}
}
function* createPhone(action) {
	try {
		const isExist = yield call(queryCheckPhone, action.phone);
		if (isExist.exist) {
			yield put({type: ERROR, message: 'This phone number already exist'});
		} else {
			const phone = yield call(queryCreatePhone, action.phone);
			yield put({type: ADD_SUCCESS, phone});
		}
	} catch (e) {
		yield put({type: ERROR, message: e.message});
	}
}

/* queries */
function queryGetPhones() {
	return fetch('/api/phones', {
		method: 'get',
		credentials: 'include'
	})
	.then(response => {
		if( 200 == response.status ) {
			return response
		} else {
			throw new Error('Cannot load data from server. Response status ' + response.status)
		}
	})
	.then(response => response.json())
}
function queryCheckPhone(phone) {
	return fetch('/api/phones/check?number=' + phone, {
		method: 'get',
		credentials: 'include'
	})
	.then(response => {
		if( 200 == response.status ) {
			return response
		} else if( 400 == response.status ) {
			throw new Error('Incorrect request')
		} else {
			throw new Error('Cannot load data from server. Response status ' + response.status)
		}
	})
	.then(response => response.json())
}
function queryDeletePhone(id) {
	return fetch('/api/phones/' + id, {
		method: 'delete',
		credentials: 'include'
	})
	.then(response => {
		if( 200 == response.status ) {
			return response
		} else if( 400 == response.status ) {
			throw new Error('Incorrect request')
		} else {
			throw new Error('Cannot load data from server. Response status ' + response.status)
		}
	})
	.then(response => response.json())
}
function queryCreatePhone(phone) {
	return fetch('/api/phones', {
		method: 'post',
		credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			number: phone
		})
	})
	.then(response => {
		if( 200 == response.status ) {
			return response
		} else if( 400 == response.status ) {
			throw new Error('Incorrect request')
		} else {
			throw new Error('Cannot load data from server. Response status ' + response.status)
		}
	})
	.then(response => response.json())
}

export default sagaPhones;