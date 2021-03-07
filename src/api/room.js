import axios from 'axios';
import { http } from '../static/config';

function addRoom(data) {
    return axios.post(
        http + '/room/addRoom',
        data
    )
}

function queryRoomList(data) {
    return axios.post(
        http + '/room/queryRoomList',
        data
    )
}

function testKCode(data) {
    return axios.post(
        http + '/room/testKCode',
        data
    )
}

function testYCode(data) {
    return axios.post(
        http + '/room/testYCode',
        data
    )
}

function querySingleRoom(data) {
    return axios.post(
        http + '/room/querySingleRoom',
        data
    )
}

function updateRoom(data) {
    return axios.post(
        http + '/room/updateRoom',
        data
    )
}

function deleteRoom(data) {
    return axios.post(
        http + '/room/deleteRoom',
        data
    )
}

export {
    addRoom,
    queryRoomList,
    testKCode,
    testYCode,
    querySingleRoom,
    updateRoom,
    deleteRoom,
}