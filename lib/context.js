// ./lib/context.js
import { createContext, useContext } from 'react';

const AppContext = createContext();
//params={params} params2={params2} tp={tp} findexarxid={localFindexarxid} view={view} tab={tab}
//sessionid={sessionid} league={localLeague} team={localTeam} player={localPlayer} setLocalLeague={setLocalLeague} setLocalTeam={setLocalTeam} setLocalPlayer={setLocalPlayer} setLocalPageType={setLocalPageType} setLocalView={setLocalView} setLocalTab={setLocalTab}
export function AppWrapper({ children, 
  userId,
  isMobile,

  params, 
  params2, 
  tp, 
  tp2,
  findexarxid,
  sid,
  sessionid,
  noUser, 
  fbclid, 
  utm_content,
  
  view, 
  tab,
  mode,
  pagetype,
  league,
  team,
  player,
  teamName,
  
  setLeague,
  setTeam,
  setPlayer,
  setPagetype,
  setView,
  setTab,
  setMode,
  setUserId,
  setTeamName,
  setSid,
}) {
  userId = userId || '';
  let sharedState = {userId,isMobile,params, params2, tp, tp2,findexarxid, sid,view, tab,sessionid,league,team,player,setLeague,setTeam,setPlayer,setPagetype,setView,setTab,noUser,mode,setMode,pagetype,fbclid, utm_content,teamName,setUserId,setTeamName,setSid}

  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}