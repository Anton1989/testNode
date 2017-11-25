import {
	GET_PHONES,
	DISMISS_ERROR,
	CHECK_PHONE,
	CREATE_PHONE,
	DELETE_PHONE
} from '../constants';

// const receiveSuccess = employees => ({ type: GET_EMPLOYEE_SUCCESS, employees })

export function getPhones() {
	return (dispatch) => {
		dispatch({
			type: GET_PHONES
		});
	}
}
export function check(phone) {
	return (dispatch) => {
		dispatch({
			type: CHECK_PHONE,
			phone
		});
	}
}
export function deletePhone(id) {
	return (dispatch) => {
		dispatch({
			type: DELETE_PHONE,
			id
		});
	}
}
export function addPhone(phone) {
	return (dispatch) => {
		dispatch({
			type: CREATE_PHONE,
			phone
		});
	}
}
export function dismissError() {
	return (dispatch) => {
		return dispatch({
			type: DISMISS_ERROR
		})
	}
}