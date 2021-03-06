import axios from 'axios';
import {http} from '../static/config';

function addStaff(data) {
    return axios.post(
        http + '/staff/addStaff',
        data
    )
}

function queryStaffList(data) {
    return axios.post(
        http + '/staff/queryStaffList',
        data
    )
}

function testYCode(data) {
    return axios.post(
        http + '/staff/testYCode',
        data
    )
}

function testUCode(data) {
    return axios.post(
        http + '/staff/testUCode',
        data
    )
}

function querySingleStaff(data) {
    return axios.post(
        http + '/staff/querySingleStaff',
        data
    )
}

function updateStaff(data) {
    return axios.post(
        http + '/staff/updateStaff',
        data
    )
}

function deleteStaff(data) {
    return axios.post(
        http + '/staff/deleteStaff',
        data
    )
}

export {
    addStaff,
    queryStaffList,
    testYCode,
    testUCode,
    querySingleStaff,
    updateStaff,
    deleteStaff,
}