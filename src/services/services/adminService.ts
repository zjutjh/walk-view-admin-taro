import {useJwtStore} from "../../stores/jwt";
import Taro from "@tarojs/taro";
import apis from "../api/apis";
import { useAdminStore } from "../../stores/admin";
import { reportErrModal } from "./wxService";

const jwt = useJwtStore();
const admin = useAdminStore();

interface verificatePasswordData {
    secret: string,
}

const verifyPassword = async (
    data: verificatePasswordData
): Promise<boolean> => {
    let passwordRight = false;
    await Taro.request({
        method: "POST",
        url: apis.admin.adminSecret,
        data: data,
        header: {
        "Authorization": "Bearer " + jwt.getJwt()
        },
        success: (res) => {
            if(res.data.code === 200 && res.data.msg === "ok"){
                passwordRight = true;
                admin.setSecret(data.secret);
            }
        },
        fail(res) { reportErrModal(res.errMsg); }
    })
    return passwordRight;
}

interface routeDetailData {
    secret: string
}

const getRouteDetail = async (
    data: routeDetailData
):Promise<any> => {
    let resData;
    await Taro.request({
        method: "GET",
        url: apis.admin.routeDetail,
        data: data,
        header: {
            "Authorization": "Bearer" + jwt.getJwt()
        },
        success: (res) => {
            if(res.data.code === 200) {
                resData = res.data.data;
            }
        },
        fail(res) { reportErrModal(res.errMsg); }
    })
    return resData;
}

const getSubmitDetail = async (
    data: routeDetailData
):Promise<any> => {
    let resData;
    await Taro.request({
        method: "GET",
        url: apis.admin.submitDetail,
        data: data,
        header: {
            "Authorization": "Bearer" + jwt.getJwt()
        },
        success: (res) => {
            if(res.data.code === 200) {
                resData = res.data.data.results;
            }
        },
        fail(res) { reportErrModal(res.errMsg); }
    })
    return resData;
}

export { verifyPassword, getRouteDetail, getSubmitDetail };