import axios from 'axios';
import { http } from '../static/config';

function addPlaces(data) {
    return axios.post(
        http + '/places/addPlaces',
        data
    )
}

function queryPlacesList(data) {
    return axios.post(
        http + '/places/queryPlacesList',
        data
    )
}

function queryAllKName() {
    return axios.get(
        http + '/places/queryAllKName'
    )
}

function testDCode(data) {
    return axios.post(
        http + '/places/testDCode',
        data
    )
}

function testDName(data) {
    return axios.post(
        http + '/places/testDName',
        data
    )
}

function querySinglePlaces(data) {
    return axios.post(
        http + '/places/querySinglePlaces',
        data
    )
}

function updatePlaces(data) {
    return axios.post(
        http + '/places/updatePlaces',
        data
    )
}

function deletePlaces(data) {
    return axios.post(
        http + '/places/deletePlaces',
        data
    )
}

export {
    addPlaces,
    queryPlacesList,
    queryAllKName,
    testDCode,
    testDName,
    querySinglePlaces,
    updatePlaces,
    deletePlaces,
}