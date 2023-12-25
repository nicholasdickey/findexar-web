import axios from 'axios';

;
/**
 * User Session
 */
/*
// Updates the user session
export const updateUserSession = async (userslug: string, options: Options) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/update-session?`;
  const res = await axios.post(url, {
    userslug,
    options
  });
  return res.data.userSession;
}

// Retrieves the user session
export const getUserSession = async (userslug: string) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/fetch-session?`;
  const res = await axios.post(url, {
    userslug
  });
  return res.data.userSession;
}

// Updates the session
export const updateSession = async (sessionid: string, config: Options) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/session/update-session?`;
    //console.log("updateSession", url, sessionid, config);
    const res = await axios.post(url, {
      sessionid,
      config
    });
    return res.data.success;
  } catch (x) {
    // console.log("updateSession", x);
  }
}

// Fetches the session
export const fetchSession = async (sessionid: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/session/fetch-session?sessionid=${sessionid} `;
    const res = await axios.get(url);
    console.log("fetchSession", sessionid, res.data.session);
    return res.data.session;
  } catch (x) {
    console.log("fetchSession", x);
  }

}
*/
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
export type LeagueTeamsKey = { func:string,league: string};
export const getLeagueTeams = async ({league}:LeagueTeamsKey) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-league-teams?league=${encodeURIComponent(league)}`;
        const res = await axios.get(url);
        console.log("getLeagueTeams",url,res.data.teams)
        return res.data.teams;
    }
    catch (e) {
        console.log("getLeagueTeams", e);
        return false;
    }
}
export type TeamPlayersKey = { league: string; teamid: string};
export const getTeamPlayers = async ({league,teamid}:TeamPlayersKey) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-team-players?league=${encodeURIComponent(league)}&teamid=${encodeURIComponent(teamid)}`;
       // console.log("url",url)
        const res = await axios.get(url);
        return res.data.players;
    }
    catch (e) {
        console.log("getTeamPlayers", e);
        return false;
    }
}
export type DetailsKey = { teamid: string; name: string};
export const getDetails = async ({teamid,name}:DetailsKey) => {
    try {
      console.log("getDetails",teamid,name)
        const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-details?teamid=${encodeURIComponent(teamid)}&name=${encodeURIComponent(name)}`;
        console.log("url",url)
        const res = await axios.get(url);
        return res.data.details;
    }
    catch (e) {
        console.log("getDetails", e);
        return false;
    }
}
export type MentionsKey = {func:string,league?: string};
export const getMentions = async ({func,league}:MentionsKey) => {
    try {
      console.log("getMenions",league)
        const url = league?`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-mentions?league=${encodeURIComponent(league)}`:`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/get-mentions`;
        console.log("url",url)
        const res = await axios.get(url);
        return res.data.mentions;
    }
    catch (e) {
        console.log("getMentions", e);
        return false;
    }
}