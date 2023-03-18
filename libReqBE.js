"use strict"


/******************************************************************************
 * ReqBE
 ******************************************************************************/
//app.ReqBE=function(req, res){
  //this.req=req; this.res=res; this.site=req.site; this.Str=[]; this.pool=mysqlPool;
  //this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]}; this.GRet=this.Out.GRet; 
//}

app.ReqBE=function(objReqRes){
  Object.assign(this, objReqRes);
  this.site=this.req.site
  //this.Str=[];  this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]};  this.GRet=this.Out.GRet; 
  this.Str=[];  this.dataArr=[];  this.GRet={userInfoFrDBUpd:{}}; 
}


ReqBE.prototype.mes=function(str){ this.Str.push(str); }
ReqBE.prototype.mesO=function(str){
  if(str) this.Str.push(str);
  this.GRet.strMessageText=this.Str.join(', ');
  this.GRet.userInfoFrIP=this.req.sessionCache.userInfoFrIP;
  var objOut=copySome({}, this, ["dataArr", "GRet"]);
  this.res.end(serialize(objOut));	
}
ReqBE.prototype.mesEO=function(errIn, statusCode=500){
  var GRet=this.GRet;
  var boString=typeof errIn=='string';
  var err=errIn; 
  if(boString) { this.Str.push('E: '+errIn); err=new MyError(errIn); } 
  else{  var tmp=err.syscal||''; this.Str.push('E: '+tmp+' '+err.code);  }
  console.log(err.stack);
  GRet.strMessageText=this.Str.join(', ');
  GRet.userInfoFrIP=this.req.sessionCache.userInfoFrIP; 

  //this.res.writeHead(500, {"Content-Type": MimeType.txt}); 
  var objOut=copySome({}, this, ["dataArr", "GRet"]);
  this.res.end(serialize(objOut));
  debugger
}



//ReqBE.prototype.clearSessionCache=async function (){
  //this.req.sessionCache={userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}};
  //var redisVar=req.redisVarSessionCache;
  //var [err]=await setRedis(redisVar, this.req.sessionCache, maxUnactivity); if(err) return [err];
  //this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
//}

ReqBE.prototype.specSetup=async function (inObj){
  var {req}=this, Ou={}, {redisVarSessionCache, sessionCache}=req;
  var Role=null; if(typeof inObj=='object' && 'Role' in inObj) Role=inObj.Role;
  //if(!checkIfUserInfoFrIP()) { callback(null,[Ou]); return } 
  var [err,boOK]=await checkIfUserInfoFrIP.call(this);   if(err) return [err];
  if(!boOK) { return [null, [Ou]];} 
  var {IP, idIP}=sessionCache.userInfoFrIP;

  var [err, result]=await runIdIP.call(this, IP, idIP); if(err) return [err];
  extend(this.GRet.userInfoFrDBUpd, result);    extend(sessionCache.userInfoFrDB, result);
  
  //setSessionMain.call(this);
  //if(!this.checkIfAnySpecialist()){this.clearSession();} // If the user once clicked login, but never saved anything then logout
  //callback(null,[Ou]);
  
  var [err]=await setRedis(redisVarSessionCache, sessionCache, maxUnactivity); if(err) return [err];
  if(!checkIfAnySpecialist.call(this)){ // If the user once clicked login, but never saved anything then logout
    //await clearSessionCache.call(this);
    extend(sessionCache, {userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}});
    var [err]=await setRedis(redisVarSessionCache, sessionCache, maxUnactivity); if(err) return [err];
    this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  } 
  return [null, [Ou]];
}



ReqBE.prototype.logout=async function (inObj){
  var {req}=this, {redisVarSessionCache, sessionCache}=req;
  //resetSessionMain.call(this);
  extend(sessionCache, {userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}});
  var [err]=await setRedis(redisVarSessionCache, sessionCache, maxUnactivity); if(err) return [err];
  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  this.mes('Logged out'); return [null, [0]];
}

ReqBE.prototype.getSchedule=async function (inObj){
  var {req}=this, {site}=req;
  var scheduleTab=site.TableName.scheduleTab;
  var Ou={}, Sql=[];
 
    // Delete all old schedules
  Sql.push("DELETE FROM "+scheduleTab+" WHERE date_add(lastActivity, INTERVAL 1 MONTH)<now();");
  Sql.push(`SELECT uuid, title, MTab, unit, intFirstDayOfWeek, intDateAlwaysInWOne, UNIX_TIMESTAMP(start) AS start, vNames, hFilter, dFilter, UNIX_TIMESTAMP(lastActivity) AS lastActivity, UNIX_TIMESTAMP(created) AS created
  FROM `+scheduleTab+` WHERE uuid=?;`);  //BIN_TO_UUID(uuid) AS uuid  // UUID_TO_BIN(?)

  var sql=Sql.join('\n'),   Val=[inObj.uuid];
  if(boMysql) {
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
    var c=results[1].length; if(c!=1) {  return [new ErrorClient(c+" rows found for that uuid")];}
    Ou.row=results[1][0];
  } else{
    var idSch=prefixRedis+inObj.uuid
    var [err, result]=await redis.hgetall(idSch).toNBP(); if(err) return [err];
    //const obj = {};   for (let i = 0; i < result.length; i += 2) { obj[result[i]] = result[i + 1]; }
    var boEmpty=isEmpty(result);
    if(boEmpty) {  return [new ErrorClient("nothing found for that uuid")];}
    var {strSch, lastActivity}=result;
    lastActivity=Number(lastActivity)
    var objSch=deserialize(strSch);
    extend(objSch,{lastActivity})
    Ou.row=objSch;
  }

  //debugger
  return [null, [Ou]];
}

ReqBE.prototype.listSchedule=async function (inObj){
  var {req}=this, {site, sessionCache}=req, {userTab, scheduleTab}=site.TableName;
  var Ou={}, Sql=[];
  
  if(!isSetObject(sessionCache.userInfoFrIP)){ return [null,[Ou]]; }

  Ou.tab=[];
  Sql.push("DELETE FROM "+scheduleTab+" WHERE date_add(lastActivity, INTERVAL 1 MONTH)<now();");
  Sql.push("SELECT uuid, title, UNIX_TIMESTAMP(created) AS created, UNIX_TIMESTAMP(lastActivity) AS lastActivity FROM "+scheduleTab+" s JOIN "+userTab+" u ON s.idUser=u.idUser WHERE u.IP=? AND u.idIP=?;");  // BIN_TO_UUID(uuid) AS uuid
  
  var {IP,idIP}=sessionCache.userInfoFrIP;
  var sql=Sql.join('\n'),   Val=[IP,idIP];  //Val=[idUser]; 
  if(boMysql) {
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
    var arrSchedule=results[1];
    var n=arrSchedule.length;
    for(var i=0;i<n;i++) {
      var row=arrSchedule[i], len=listCol.KeyCol.length, rowN=Array(len);
      for(var j=0;j<len;j++){ var key=listCol.KeyCol[j]; rowN[j]=row[key]; }
      Ou.tab.push(rowN);
    }
  } else{
    var idUser=prefixRedis+IP+'_'+idIP
    var [err, result]=await redis.pollDeletion(idUser).toNBP(); if(err) return [err];
    var [err, IdSch]=await redis.smembers(idUser).toNBP(); if(err) return [err];
    var nSch=IdSch.length;
    for(var i=0;i<nSch;i++) {
      var idSch=IdSch[i]
      var [err, result]=await redis.hgetall(idSch).toNBP(); if(err) return [err];
      var {idUser, strSch, lastActivity, created}=result
      lastActivity=Number(lastActivity); created=Number(created);
      var objSch=deserialize(strSch), {title}=objSch;
      var idSchWOPrefix=idSch.substring(prefixRedis.length)
      var rowN=[idSchWOPrefix, title, created, lastActivity]
      Ou.tab.push(rowN); //['7c5556cbe87ccbf60388a0becd96fc0ff57c', '', 1678498453, 1678498458]
      //debugger
    }
  }
  //debugger

  return [null, [Ou]];
}

ReqBE.prototype.saveSchedule=async function (inObj){
  var {req}=this, {site, siteName, sessionCache}=req;
  var scheduleTab=site.TableName.scheduleTab;
  var Ou={}, Sql=[];

  var IP='fb', idIP='';  if(isSetObject(sessionCache.userInfoFrIP)){ ({IP,idIP}=sessionCache.userInfoFrIP); }
  var Val=[IP, idIP];
  
  
  for(var name in inObj){
    //inObj[name]=myJSEscape(inObj[name]);
    var value=inObj[name];
    if(typeof value=='string') inObj[name]=myJSEscape(value);
  }
  
  var {lastActivity=0, uuid=null}=inObj;
  Val.push(lastActivity, uuid);

  //eval(extractLocSome('inObj',['title','MTab','unit','intFirstDayOfWeek','intDateAlwaysInWOne','vNames','hFilter','dFilter','start']));
  var tmp=copySomeToArr([], inObj, ['title','MTab','unit','intFirstDayOfWeek','intDateAlwaysInWOne','start', 'vNames','hFilter','dFilter']);  array_mergeM(Val,tmp);

  Sql.push("CALL "+siteName+"save(?,?,?,?, ?,?,?,?,?,?,?,?,?);");
  var sql=Sql.join('\n'); 
  if(boMysql) {
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
    var len=results.length; 
    if(len==2){
      var strTmp=results[0][0].mess; if(results[0][0].mess=='boOld') {strTmp="Someone else has changed the table, use reload to get the latest version";  } 
      return [new ErrorClient(strTmp)];
    }
    var c=results[0][0].nUpd; if(c!=1) { return [new ErrorClient("updated rows: "+c)]; }
    var rowA=results[len-2][0];
    //rowA.lastActivity=
    copySome(Ou,rowA,['lastActivity', 'uuid']);  
  } else{
    var objSch=copySome({}, inObj, ['title','MTab','unit','intFirstDayOfWeek','intDateAlwaysInWOne','start', 'vNames','hFilter','dFilter'])
    if(!uuid) uuid=genRandomString(32)
    var strSch=serialize(objSch);
    var idUser=prefixRedis+IP+'_'+idIP
    var idSch=prefixRedis+uuid
    var [err, mess]=await redis.saveSch(idUser, idSch, strSch, lastActivity, unixNow()).toNBP(); if(err) return [err];
    if(mess=='old') {var strTmp="Someone else has changed the table, use reload to get the latest version"; return [new ErrorClient(strTmp)]; }
    extend(Ou,{uuid, lastActivity})
  }
  //debugger


  return [null, [Ou]];

}

ReqBE.prototype.deleteSchedule=async function (inObj){
  var {req}=this, {site, siteName, sessionCache}=req, {userTab, scheduleTab}=site.TableName;
  var Ou={}, Sql=[];

  if(isSetObject(sessionCache.userInfoFrIP)){
    var {IP,idIP}=sessionCache.userInfoFrIP, uuid=inObj.uuid;//,  idUser=sessionCache.userInfoFrDB.customer.idUser;

    Sql.push("CALL "+siteName+"delete(?,?,?);");
    var Val=[]; Val.push(IP, idIP, uuid);
    var sql=Sql.join('\n'); 
    if(boMysql) {
      var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
      var len=results.length, rowLast=results[len-2];
      if('mess' in rowLast) { return [new ErrorClient(rowLast.mess)]; }
      var nDelete=results[0][0].nDelete; if(nDelete!=1) { return [new ErrorClient(nDelete+" schedules deleted")]; }
      Ou.nRemaining=results[1][0].nRemaining;
    } else{
      var idUser=prefixRedis+IP+'_'+idIP
      var idSch=prefixRedis+uuid
      var [err, result]=await redis.deleteSch(idUser, idSch).toNBP(); if(err) return [err];
      //var [mess, boDeleted=false, boDeletedS=false, nRemaining=false]=result
      var mess=result
      this.mes(mess);
      //extend(Ou, {boDeleted, boDeletedS, nRemaining});
    }
    //debugger
    

    return [null, [Ou]];
  }  
}




ReqBE.prototype.go=async function (){
  var {req, res}=this, {site, redisVarSessionCache, sessionCache}=req;

  //var [err, val]=await getRedis(redisVarSessionCache,1);  if(err) {this.mesEO(err);  return; }    this.sessionCache=val;
  if(!sessionCache || typeof sessionCache!='object') { 
    //resetSessionMain.call(this);
    extend(sessionCache, {userInfoFrDB:extend({},specialistDefault),   userInfoFrIP:{}});
    var [err]=await setRedis(redisVarSessionCache, sessionCache, maxUnactivity); if(err){ this.mesEO(err); return;}
  }

  var [err]=await expireRedis(redisVarSessionCache, maxUnactivity); if(err){ this.mesEO(err); return;}
  
  
  var jsonInput;
  if(req.method=='POST'){ 
    if('x-type' in req.headers ){ //&& req.headers['x-type']=='single'
      var form = new formidable.IncomingForm();
      form.multiples = true;  

      var [err, fields, files]=await new Promise(resolve=>{  form.parse(req, (...arg)=>resolve(arg));  });     if(err){ this.mesEO(err); return; } 

      this.File=files['fileToUpload[]'];
      if('kind' in fields) this.kind=fields.kind; else this.kind='s';
      if(!(this.File instanceof Array)) this.File=[this.File];
      jsonInput=fields.vec;
      
    }else{
      var [err,buf]=await new Promise(resolve=>{  var myConcat=concat(bT=>resolve([null,bT]));    req.pipe(myConcat);  });
      jsonInput=buf.toString();
    }
  }
  else if(req.method=='GET'){
    this.mesEO(new Error('No GET requests please.'));  return; 
    var objUrl=url.parse(req.url), qs=objUrl.query||''; jsonInput=urldecode(qs);
  }



  //res.setHeader("Content-type", MimeType.json);
    
  try{ var beArr=JSON.parse(jsonInput); }catch(e){ console.log(e); res.out500('Error in JSON.parse, '+e); return; }
  
  if(!req.boCookieStrictOK) {this.mesEO(new Error('Strict cookie not set'));  return;   }
  

    // Remove the beArr[i][0] values that are not functions
  var CSRFIn, caller='index';
  for(var i=beArr.length-1;i>=0;i--){ 
    var row=beArr[i];
    if(row[0]=='CSRFCode') {CSRFIn=row[1]; array_removeInd(beArr,i);}
  }

  var len=beArr.length;
  var StrInFunc=Array(len); for(var i=0;i<len;i++){StrInFunc[i]=beArr[i][0];}
  var arrCSRF, arrNoCSRF, allowed, boCheckCSRF, boSetNewCSRF;

           // Arrays of functions
    // Functions that changes something must check and refresh CSRF-code
  var arrCSRF=['createSchedule','deleteSchedule'];
  var arrNoCSRF=['specSetup','logout','getSchedule','saveSchedule','listSchedule'];
  allowed=arrCSRF.concat(arrNoCSRF);

    // Assign boCheckCSRF and boSetNewCSRF
  boCheckCSRF=0; boSetNewCSRF=0;   for(var i=0; i<beArr.length; i++){ var row=beArr[i]; if(in_array(row[0],arrCSRF)) {  boCheckCSRF=1; boSetNewCSRF=1;}  }    
  if(StrComp(StrInFunc,['getSchedule'])){ boCheckCSRF=0; boSetNewCSRF=1; } 
  if(StrComp(StrInFunc,['specSetup','listSchedule'])){ boCheckCSRF=0; boSetNewCSRF=1; } 
  if(StrComp(StrInFunc,['specSetup','listSchedule','getSchedule'])){ boCheckCSRF=0; boSetNewCSRF=1; } 
  



    // cecking/set CSRF-code
  var redisVar=req.sessionID+'_CSRFCode'+ucfirst(caller), CSRFCode;
  if(boCheckCSRF){
    if(!CSRFIn){ this.mesO('CSRFCode not set (try reload page)'); return;}
    var [err, CSRFStored]=await getRedis(redisVar); if(err) {this.mesEO(err);  return; }
    if(CSRFIn!==CSRFStored){ this.mesO('CSRFCode err (try reload page)'); return;}
  }
  if(boSetNewCSRF){
    var CSRFCode=randomHash();
    var [err]=await setRedis(redisVar, CSRFCode, maxUnactivity); if(err){ this.mesEO(err); return;}
    this.GRet.CSRFCode=CSRFCode;
  }


  var Func=[];
  for(var k=0; k<beArr.length; k++){
    var strFun=beArr[k][0];
    if(in_array(strFun,allowed)) {
      var inObj=beArr[k][1],     tmpf; if(strFun in this) tmpf=this[strFun]; else tmpf=global[strFun];
      if(typeof inObj=='undefined' || typeof inObj=='object') {} else {this.mesO('inObj should be of type object or undefined'); return;}
      var fT=[tmpf,inObj];   Func.push(fT);
    }
  }
  
  for(var k=0; k<Func.length; k++){
    var [func,inObj]=Func[k],   [err, result]=await func.call(this, inObj);
    if(res.finished) return;
    else if(err){
      if(typeof err=='object' && err.name=='ErrorClient') this.mesO(err); else this.mesEO(err);     return;
    }
    else this.dataArr.push(result);
  }
  this.mesO();

}







