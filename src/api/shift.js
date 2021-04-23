import axios from 'axios';
import { http } from '../static/config';

function addShift(data) {
    return axios.post(
        http + '/shift/addShift',
        data
    )
}

function queryShiftList(data) {
    return axios.post(
        http + '/shift/queryShiftList',
        data
    )
}

function queryAllBName() {
    return axios.get(
        http + '/shift/queryAllBName'
    )
}

function querySingleShift(data) {
    return axios.post(
        http + '/shift/querySingleShift',
        data
    )
}

function updateShift(data) {
    return axios.post(
        http + '/shift/updateShift',
        data
    )
}

function deleteShift(data) {
    return axios.post(
        http + '/shift/deleteShift',
        data
    )
}

export {
    addShift,
    queryShiftList,
    queryAllBName,
    querySingleShift,
    updateShift,
    deleteShift,
}