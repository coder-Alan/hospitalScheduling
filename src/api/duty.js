import axios from 'axios';
import { http } from '../static/config';

function addDuty(data) {
    return axios.post(
        http + '/duty/addDuty',
        data
    )
}

function queryDutyList(data) {
    return axios.post(
        http + '/duty/queryDutyList',
        data
    )
}

function queryAllBName() {
    return axios.get(
        http + '/duty/queryAllBName'
    )
}

function testZCode(data) {
    return axios.post(
        http + '/duty/testZCode',
        data
    )
}

function testZPeople(data) {
    return axios.post(
        http + '/duty/testZPeople',
        data
    )
}

function querySingleDuty(data) {
    return axios.post(
        http + '/duty/querySingleDuty',
        data
    )
}

function updateDuty(data) {
    return axios.post(
        http + '/duty/updateDuty',
        data
    )
}

function deleteDuty(data) {
    return axios.post(
        http + '/duty/deleteDuty',
        data
    )
}

export {
    addDuty,
    queryDutyList,
    testZCode,
    testZPeople,
    queryAllBName,
    querySingleDuty,
    updateDuty,
    deleteDuty,
}