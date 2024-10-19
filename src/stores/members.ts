import {defineStore} from "pinia";
import {member} from "../types/teamStatus";
import {ref} from "vue";

export interface memberStorageType {
  name: string,
  jwt: string,
  status: number,//0代表未处理 1代表已放行 2代表已放弃
  type: number, // 1student 2teacher
}

export const useMembersStore = defineStore("members",() => {
  const membersStorage = ref<memberStorageType[]>([{
    name: "",
    jwt: "",
    status: 0,
    type: 1
  }]);
  const initMembers = (members: member[]) => {
    console.log(members);
    membersStorage.value = new Array(members.length);
    for (let idx = 0 ;idx < members.length ; idx ++) {
      console.log(idx);
      membersStorage.value[idx] = { name: members[idx]["name"] , jwt: members[idx]["open_id"], status: members[idx]["walk_status"], type: members[idx]['type'] };
    }
    console.log(membersStorage.value);
  };
  const getJwt = (id: number) => {
    return membersStorage[id]["jwt"];
  };
  const getMembers = () => {
    return membersStorage.value;
  };
  return  { initMembers , membersStorage , getJwt , getMembers};
});
