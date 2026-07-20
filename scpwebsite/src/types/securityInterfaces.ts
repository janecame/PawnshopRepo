export interface Group {
  groupCode: string;
  groupName: string;
}

export interface User {
  userCode: string;
  userName: string;
  completeName: string;
  pWord: string | null;
  cnCode: string;
  groupCode: string;
  groupName: string | null;
  active: boolean | null;
  smCode: string;
}



export interface RegisterListAppKeys {
  appKey: string;
  activityDate: string;
  approved: boolean;
  remarks: string | null;
  active: boolean;
}