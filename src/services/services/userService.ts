import apis from "../api/apis";
import Taro from "@tarojs/taro";
import { useJwtStore } from "../../stores/jwt";

interface checkInData {
    code_type: number,
    content: string,
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
        }
    })
    return false;
}

export { checkIn }