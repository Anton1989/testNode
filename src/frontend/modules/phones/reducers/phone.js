import { GET_PHONES, ERROR, SUCCESS, ADD_SUCCESS, DISMISS_ERROR, DELETE_SUCCESS, CREATE_PHONE, DELETE_PHONE } from '../constants';

const initialState = {
    data: [],
    errors: null,
    fetching: false
}

export default function phone(state = initialState, action) {
    switch (action.type) {
        case DELETE_PHONE:
        case CREATE_PHONE:
        case GET_PHONES:
            return { ...state, fetching: true }
        case SUCCESS:
            return { ...state, data: action.phones, fetching: false, errors: null }
        case ADD_SUCCESS: {
            let data = [...state.data];
            data.push(action.phone)
            return { ...state, data, fetching: false, errors: null }
        }
        case DELETE_SUCCESS: {
            let data = state.data.filter(phone => phone.id != action.id);
            return { ...state, data, fetching: false, errors: null }
        }
        case ERROR:
            return { ...state, errors: action.message, fetching: false }
        case DISMISS_ERROR:
            return { ...state, errors: null }
        default:
            return state;
    }
}
