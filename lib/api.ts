import axios from 'axios';
// Records event
export const recordEvent = async (sessionid: string, name: string, params: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/record-event?sessionid=${encodeURIComponent(sessionid)}&name=${encodeURIComponent(name)}&params=${encodeURIComponent(params)}`;
      const res = await axios.get(url);
      return res.data.success;
    }
    catch (e) {
      console.log("recordEvent", e);
      return false;
    }
}

// Get all Leagues
export const getLeagues = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-leagues`;
      const res = await axios.get(url);
      return res.data.leagues;
    }
    catch (e) {
      console.log("recordEvent", e);
      return false;
    }
}

// SWR get all teams for the League
export type LeagueTeamsKey = { func:string,league: string};
export const getLeagueTeams = async ({league}:LeagueTeamsKey) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-league-teams?league=${encodeURIComponent(league)}`;
    const res = await axios.get(url);
    return res.data.teams;
  }
  catch (e) {
    console.log("getLeagueTeams", e);
    return false;
  }
}

// SWR get all players for the Team
export type TeamPlayersKey = { league: string; teamid: string};
export const getTeamPlayers = async ({league,teamid}:TeamPlayersKey) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-team-players?league=${encodeURIComponent(league)}&teamid=${encodeURIComponent(teamid)}`;
    const res = await axios.get(url);
    return res.data.players;
  }
  catch (e) {
    console.log("getTeamPlayers", e);
    return false;
  }
}

// SWR get all details for the Team
export type DetailsKey = { teamid: string; name: string};
export const getDetails = async ({teamid,name}:DetailsKey) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-details?teamid=${encodeURIComponent(teamid)}&name=${encodeURIComponent(name)}`;
    const res = await axios.get(url);
    return res.data.details;
  }
  catch (e) {
    console.log("getDetails", e);
    return false;
  }
}

// SWR get all mentions
export type MentionsKey = {func:string,league?: string};
export const getMentions = async ({func,league}:MentionsKey) => {
  try {
    const url = league?`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-mentions?league=${encodeURIComponent(league)}`:`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-mentions`;
    const res = await axios.get(url);
    return res.data.mentions;
  }
  catch (e) {
    console.log("getMentions", e);
    return false;
  }
}

// SWR get expanded meta
export type MetaLinkKey = {func:string,xid?: string};
export const getMetaLink = async ({func,xid}:MetaLinkKey) => {
  try {
    const url =`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-meta-link?xid=${xid}`;
    const res = await axios.get(url);
    return res.data.meta;
  }
  catch (e) {
    console.log("getMeta", e);
    return false;
  }
}

// SWR get player photo
export type PlayerPhotoKey = {func:string,name: string,teamid: string};
export const getPlayerPhoto = async ({func,name,teamid}:PlayerPhotoKey) => {
  try {
    const url =`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-player-photo?name=${name}&teamid=${teamid}`;
    const res = await axios.get(url);
    return res.data.photo;
  }
  catch (e) {
    console.log("getPlayerPhoto", e);
    return '';
  }
}

// SWR get user lists from web api (protected by Clerk)
export type UserListsKey = {type:string};
export const getUserLists = async ({type}:UserListsKey) => {
  try {
    const url =`${process.env.NEXT_PUBLIC_SERVER}/api/user/get-lists`;
    const res = await axios.get(url);
    return res.data.lists;
  }
  catch (e) {
    console.log("getUserLists", e);
    return '';
  }
}
// SWR get user lists from web api (protected by Clerk)
export type UserAddListParams = {name:string,description:string};
export const addUserList = async ({name,description}:UserAddListParams) => {
  try {
    const url =`${process.env.NEXT_PUBLIC_SERVER}/api/user/add-list?name=${name}&description=${description}`;
    const res = await axios.get(url);
    return true;
  }
  catch (e) {
    console.log("addUserList", e);
    return false;
  }
}

export type UpdateListParams = {listxid:string,name:string,description:string};
export const updateUserList = async ({name,description,listxid}:UpdateListParams) => {
  try {
    const url =`${process.env.NEXT_PUBLIC_SERVER}/api/user/update-list?listxid=${listxid}&name=${name}&description=${description}`;
    const res = await axios.get(url);
    return true;
  }
  catch (e) {
    console.log("addUserList", e);
    return false;
  }
}

export type UserListMembersKey = {type:string,listxid:string};
export const getUserListMembers = async ({type,listxid}:UserListMembersKey) => {
  try {
    const url =`${process.env.NEXT_PUBLIC_SERVER}/api/user/get-list-members?listxid=${listxid}`;
    const res = await axios.get(url);
    return res.data.members;
  }
  catch (e) {
    console.log("getUserListMembers", e);
    return [];
  }
}

export type UserUpdateListMembersParams = {listxid:string,members:{member:string,teamid:string}[]};
export const updateUserListMembers = async ({listxid,members}:UserUpdateListMembersParams) => {
  try {
    const url =`${process.env.NEXT_PUBLIC_SERVER}/api/user/update-list-members?listxid=${listxid}`;
    const res = await axios.put(url,{
      members
    });
    return res.data.members;
  }
  catch (e) {
    console.log("getUserListMembers", e);
    return [];
  }
}