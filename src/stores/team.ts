import {defineStore} from "pinia";
import {ref} from "vue";
import Taro from "@tarojs/taro";

export const useTeamStore = defineStore("team",() => {
  const team_id = ref(-1);

  const setTeamId = (id: number) => {
    team_id.value = id;
    Taro.setStorageSync("team_id", id);
  };

  const getTeamId = () => {
    if(team_id.value !== -1) return team_id.value;
    return Taro.getStorageSync("team_id");
  };

  return {
    team_id,
    setTeamId,
    getTeamId,
  };
});
