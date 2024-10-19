import apis from "../api/apis";
import Taro from "@tarojs/taro";
import { useJwtStore } from "../../stores/jwt";
import { reportErrModal } from "./wxService";

interface checkInData {
    code_type: number,
    content: string,
}

interface setUserStateData {
    list: {
        user_id: string, //openid
        status: number,
    }[]
}

const jwt = useJwtStore();

const checkIn = async (
    data: checkInData
): Promise<boolean> => {
    await Taro.request({
        method: "POST",
        url: apis.user.scanCheckInCode,
        data: data,
        header: {
            "Authorization": "Bearer " + jwt.getJwt()
        },
        success: (res) => {
            if(res.data.code == 200) {
                Taro.showModal({
                    title: "签到成功",
                    content: "队伍剩余"+res.data.data.progress_num+"人",
                })
                return true;
            } else { 
                Taro.showModal({
                    title: "签到失败",
                    content: res.data.msg,
                })
            }
        },
        fail(res) { reportErrModal(res.errMsg); }
    })
    return false;
}

const setUserState = async (
    data: setUserStateData
): Promise<boolean> => {
    let sucFlag = false;
    await Taro.request({
        method: "POST",
        url: apis.user.setUserState,
        data: data,
        header: {
            "Authorization": "Bearer " + jwt.getJwt()
        },
        success: (res) => {
            if(res.data.code === 200) {
                sucFlag = true;
            }
        },
        fail(res) { reportErrModal(res.errMsg); }
    })
    return sucFlag;
}

export { checkIn, setUserState }