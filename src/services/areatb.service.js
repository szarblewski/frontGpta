import axios from "axios";
const configurl = require("../_helpers/config_urls.json");

const URL_AREATB = `${configurl.apiUrl}${configurl.urlareatb}`;

async function getAreatb() {
    console.log(URL_AREATB);
    const response = await axios.get(URL_AREATB);
    console.log(response.data);
    return response.data;
}

async function getAreatbById(id) {
    const response = await axios.get(`${URL_AREATB}/${id}`);
    return response.data;
}

async function insertAreatb(data) {
    const response = await axios.post(URL_AREATB, data);
    return response.data;
}

async function updateAreatb(data) {
    const response = await axios.put(`${URL_AREATB}/${data.id}`, data);
    return response.data;
}

async function deleteAreatb(id) {
    const response = await axios.delete(`${URL_AREATB}/${id}`);
    return response.data;
}

const areatbService = {
    getAreatb,
    getAreatbById,
    insertAreatb,
    updateAreatb,
    deleteAreatb
};

export default areatbService;
