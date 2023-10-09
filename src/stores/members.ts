import {defineStore} from "pinia";
import {member} from "../types/teamStatus";
import {ref} from "vue";

export interface memberStorageType {
  name: string,
  openId: string,
  status: number,//0代表未处理 1代表已放行 2代表已放弃
}

export const useMembersStore = defineStore("members",() => {
  const membersStorage = ref<memberStorageType[]>([{
    name: "",
    openId: "",
    status: 0,
  }]);
  const initMembers = (members: member[]) => {
    console.log(members);
    membersStorage.value = new Array(members.length);
    for (let idx = 0 ;idx < members.length ; idx ++) {
      console.log(idx);
      membersStorage.value[idx] = { name: members[idx]["name"] , openId: members[idx]["open_id"], status: 0 };
    }
    console.log(membersStorage.value);
  };
  const getOpenId = (id: number) => {
    return membersStorage[id]["openId"];
  };
  const getMembers = () => {
    return membersStorage.value;
  };
  const handleMember = (id: number,res: number) => {
    membersStorage.value[id]["status"] = res;
  };
  const dealMember = (open_id: string,res: number) => {
    for(let idx = 0;idx < membersStorage.value.length ; idx ++) {
      if(membersStorage.value[idx]["openId"] === open_id) {
        membersStorage.value[idx]["status"] = res;
        console.log(membersStorage.value[idx]);
      }
    }
    return;
  };
  return  { initMembers , membersStorage , getOpenId , getMembers , handleMember , dealMember};
});
