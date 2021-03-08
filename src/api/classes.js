import axios from 'axios';
import { http } from '../static/config';

function addClasses(data) {
    return axios.post(
        http + '/classes/addClasses',
        data
    )
}

function queryClassesList(data) {
    return axios.post(
        http + '/classes/queryClassesList',
        data
    )
}

function testBCode(data) {
    return axios.post(
        http + '/classes/testBCode',
        data
    )
}

function testBName(data) {
    return axios.post(
        http + '/classes/testBName',
        data
    )
}

function querySingleClasses(data) {
    return axios.post(
        http + '/classes/querySingleClasses',
        data
    )
}

function updateClasses(data) {
    return axios.post(
        http + '/classes/updateClasses',
        data
    )
}

function deleteClasses(data) {
    return axios.post(
        http + '/classes/deleteClasses',
        data
    )
}

export {
    addClasses,
    queryClassesList,
    testBCode,
    testBName,
    querySingleClasses,
    updateClasses,
    deleteClasses,
}