import {defineStore} from "pinia";
import {member} from "../types/teamStatus";
import {ref} from "vue";

export interface memberStorageType {
  name?: string
  user_id: string,
  walk_status: number,//0代表未处理 1代表已放行 2代表已放弃
}


export const useMembersStore = defineStore("members",() => {
  const membersStorage = ref<memberStorageType[]>([{
    name: "",
    user_id: "",
    walk_status: 0,
  }]);
  const originMembersStorage = ref<memberStorageType[]>([{    name: "",
    user_id: "",
    walk_status: 0,
  }]);
  const initMembers = (members: member[]) => {
    console.log(members);
    membersStorage.value = new Array(members.length);
    for (let idx = 0 ;idx < members.length ; idx ++) {
      console.log(idx);
      membersStorage.value[idx] = { name: members[idx]["name"], user_id: members[idx]["open_id"], walk_status: 1 };
    }
    originMembersStorage.value = JSON.parse(JSON.stringify(membersStorage.value));
    console.log(membersStorage.value);
  };
  const getOpenId = (id: number) => {
    return membersStorage[id]["user_id"];
  };
  // TODO:需要注意的是这里的getMembers是为了符合后端的数据格式而写的，返回的Data不包含name
  const getMembers = () => {
    console.log("执行删除操作");
    const ouputMembers: memberStorageType[] = JSON.parse(JSON.stringify(membersStorage.value));
    for (let idx = 0 ;idx < membersStorage.value.length ; idx ++) {
      delete ouputMembers[idx]["name"];
    }
    return ouputMembers;
  };
  const handleMember = (id: number,res: number) => {
    membersStorage.value[id]["walk_status"] = res;
  };
  const dealMember = (open_id: string,res: number) => {
    for(let idx = 0;idx < membersStorage.value.length ; idx ++) {
      if(membersStorage.value[idx]["user_id"] === open_id) {
        membersStorage.value[idx]["walk_status"] = res;
        console.log(membersStorage.value[idx]);
      }
    }
    return;
  };

  const getName = (id: number) => {
    return membersStorage.value[id]["name"];
  };

  const deletByUserId = (openId: string) => {
    for(let idx = 0;idx < membersStorage.value.length ; idx ++) {
      if(membersStorage.value[idx]["user_id"] === openId) {
        membersStorage.value.splice(idx,1);
      }
    }
  };
  return  { initMembers , membersStorage , getOpenId , getMembers , handleMember , dealMember , getName , deletByUserId , originMembersStorage};
});
