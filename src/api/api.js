import axios from 'axios';
// 服务器地址
const http = 'http://192.168.1.5:3000';

function addUser(data) {
    return axios.post(
        http + '/api/addUser',
        data
    )
}

function queryUserList(data) {
    return axios.post(
        http + '/api/queryUserList',
        data
    )
}

function getPower(data) {
    return axios.post(
        http + '/api/queryPower', 
        data
    )
}

function getAllPower() {
    return axios.post(
        http + '/api/queryAllPower'
    )
}

function testName(data) {
    return axios.post(
        http + '/api/testName', 
        data
    )
}

function testNickName(data) {
    return axios.post(
        http + '/api/testNickName',
        data
    )
}

function querySingleUser(data) {
    return axios.post(
        http + '/users/querySingleUser',
        data
    )
}

function updateUser(data) {
    return axios.post(
        http + '/users/updateUser',
        data
    )
}

function deleteUser(data) {
    return axios.post(
        http + '/users/deleteUser',
        data
    )
}

export {
    addUser,
    queryUserList,
    getPower,
    getAllPower,
    testName,
    testNickName,
    querySingleUser,
    updateUser,
    deleteUser,
}