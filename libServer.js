
"use strict"
app.runIdIP=async function(IP, idIP){ //check  idIP against the user-table and return diverse data
  var {siteName}=this.req, {site}=this, {TableName}=site, {userTab}=TableName;
  var nArg=arguments.length, callback=arguments[nArg-1];
  var userInfoFrDBUpd={};

  var Sql=[];
  Sql.push("SELECT * FROM "+userTab+" WHERE IP=? AND idIP=?;");
  var sql=Sql.join('\n'), Val=[IP, idIP];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var c=results.length;   userInfoFrDBUpd.customer=c==1?results[0]:0;   if(c>1){ console.log("count>1 ("+c+")"); }
  return [null, userInfoFrDBUpd]; 
}

app.checkIfUserInfoFrIP=async function(){ 
  var {req}=this, {redisVarSessionCache, sessionCache}=req
  if('userInfoFrIP' in sessionCache && 'IP' in sessionCache.userInfoFrIP){ return [null,true]; }
  else{ 
    extend(sessionCache, {userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}});
    var [err]=await setRedis(redisVarSessionCache, sessionCache, maxUnactivity);  if(err) return [err];
    return [null,false];
  }
}
app.checkIfAnySpecialist=function(){
  var tmpEx=this.req.sessionCache.userInfoFrDB
  return Boolean(tmpEx.customer);
}


app.createSiteSpecificClientJSAll=async function() {
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i];
    var buf=createSiteSpecificClientJS(siteName);
    var keyCache=siteName+'/'+leafSiteSpecific;
    var [err]=await CacheUri.set(keyCache, buf, 'js', true, true); if(err) return [err];

    var buf=createManifest(siteName);
    var keyCache=siteName+'/'+leafManifest;
    var [err]=await CacheUri.set(keyCache, buf, 'json', true, true); if(err) return [err];
  }
  return [null];
}
var createSiteSpecificClientJS=function(siteName) {
  var site=Site[siteName], wwwSite=site.wwwSite;

  var StrSkip=['TableName', 'googleAnalyticsTrackingID', 'serv'];
  var Key=Object.keys(site), siteSimplified={};
  for(var i=0;i<Key.length;i++){ var name=Key[i]; if(StrSkip.indexOf(name)==-1) siteSimplified[name]=site[name]; }

  var Str=[];
  Str.push("globalThis.assignSiteSpecific=function(){");

  var StrVar=['boDbg', 'version', 'intMax', 'leafLogin', 'leafBE', 'flImageFolder', 'specialistDefault', 'wwwCommon', 'siteName', 'listCol', 'enumVoid', 'enumY', 'enumN' ];
  var objOut=copySome({},app,StrVar);
  //copySome(objOut,site,['wwwSite']);
  objOut.site=siteSimplified;

  Str.push(`var tmp=`+JSON.stringify(objOut)+`;\n Object.assign(window, tmp);`);

  Str.push("}");

  var str=Str.join('\n');
  return str;


}


app.createManifest=function(siteName){
  var site=Site[siteName], {wwwSite, icons}=site;
  var uSite="https://"+wwwSite;
  let objOut={theme_color:"#ff0", background_color:"#fff", display:"minimal-ui", prefer_related_applications:false, short_name:siteName, name:siteName, start_url: uSite, icons }

  //let str=serialize(objOut);
  let str=JSON.stringify(objOut);
  return str;
}

app.createManifestNStoreToCache=async function(siteName){
  var strT=createManifest(siteName);
  var buf=Buffer.from(strT, 'utf8');
  var [err]=await CacheUri.set(siteName+'/'+leafManifest, buf, 'json', true, false);   if(err) return [err];
  return [null];
}
app.createManifestNStoreToCacheMult=async function(SiteName){
  for(var i=0;i<SiteName.length;i++){
    var [err]=await createManifestNStoreToCache(SiteName[i]);   if(err) return [err];
  }
  return [null];
}

