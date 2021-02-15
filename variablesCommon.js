

two31=Math.pow(2,31);  intMax=two31-1;  intMin=-two31;
sPerDay=24*3600;  sPerMonth=sPerDay*30;



fsWebRootFolder=process.cwd();
flLibFolder='lib';

flFoundOnTheInternetFolder=flLibFolder+"/foundOnTheInternet";
//flLibImageFolder=flLibFolder+"/image";  
flImageFolder=flLibFolder+"/image";
flLogFolder="log";

  // Files: 
leafBE='be.json';
leafSiteSpecific='siteSpecific.js'; 
leafLogin="login.html";
leafLoginBack="loginBack.html";
leafManifest='manifest.json';
leafDataDelete='dataDelete';
leafDataDeleteStatus='dataDeleteStatus';
leafDeAuthorize='deAuthorize';




tmpSubTab='tmpDataTab';
sqlTempSubTabCreate="CREATE TEMPORARY TABLE IF NOT EXISTS "+tmpSubTab+" (name varchar(128) NOT NULL,  boOn TINYINT(1) NOT NULL,  UNIQUE KEY (name));";

listCol={};
listCol.KeyCol=['uuid','title'    ,'created','lastActivity'];
listCol.dateMask=[0,0,0,  1,1];
listCol.backSel=[0,1,2,3,4]; 
listCol.backVis=[2,3,4]; 


  //Enum names
Enum={};
Enum.IP=['openid', 'fb','google'];
enumVoid=0; enumY=2; enumN=1;



//siteName='syncameeting';


   // DB- tables
StrTableKey=["schedule","user"]; 
StrViewsKey=[]; 
TableNameProt={};for(var i=0;i<StrTableKey.length;i++) TableNameProt[StrTableKey[i]]='';
ViewNameProt={};for(var i=0;i<StrViewsKey.length;i++) ViewNameProt[StrViewsKey[i]]='';


specialistDefault={'customer':0};

codeLen=8;
version='2';


IntSizeIcon=[16, 114, 192, 200, 512, 1024];
IntSizeIconFlip=array_flip(IntSizeIcon);
SiteExtend=function(){
  Site.getSite=function(wwwReq){
    for(var i=0;i<SiteName.length;i++){
      var siteName=SiteName[i];   var tmp; if(tmp=Site[siteName].testWWW(wwwReq)) {return {siteName, wwwSite:tmp};  }
    }
    return {siteName:null};
  }
  var regExtractDomain=RegExp("^[^/]+");
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i], site=Site[siteName];
    //site.TableName={}; for(var j=0;j<StrTableKey.length;j++){ var value=StrTableKey[j]; site.TableName[value+"Tab"]=siteName+'_'+value; }
    site.TableName={};   for(var name in TableNameProt){  site.TableName[name+"Tab"]=siteName+'_'+name; }
    site.ViewName={}; for(var name in ViewNameProt){  site.ViewName[name+"View"]=siteName+'_'+name; }
    
    //if('domainReg' in site) {  site.regexp=RegExp(site.domainReg);       site.testDomain=function(domain){ return this.regexp.test(domain);};    } 
    //else site.testDomain=function(domain){ return this.domain===domain;};

    var Match=regExtractDomain.exec(site.wwwSite); if(!Match) {console.log('site.wwwSite looks weird'); process.exit(1);}
    site.domain=Match[0];

    site.testWWW=function(wwwReq){
      if(wwwReq.indexOf(this.wwwSite)==0) return this.wwwSite; else return false;
    };
    
    
    site.SrcIcon=Array(IntSizeIcon.length);
    site.icons=Array(IntSizeIcon.length);
    var strType='png', wsIconProt=site.wsIconProt || wsIconDefaultProt;
  
    IntSizeIcon.forEach((size, ind)=>{
      site.SrcIcon[ind]=wsIconProt.replace("<size>", size);
      site.icons[ind]={ src:site.SrcIcon[ind], type: mime.getType(strType), sizes: size+"x"+size, purpose: "any maskable" };
    });
  }
/*
  Site.getName=function(domainName){
    for(var i=0;i<SiteName.length;i++){
      var siteName=SiteName[i];   if(Site[siteName].testDomain(domainName)) return siteName;
    }
    return false;
  }
*/
}


nDBConnectionLimit=10; nDBQueueLimit=100;
nDBRetry=14;

setUpMysqlPool=function(){
  var uriObj=url.parse(uriDB);
  var StrMatch=RegExp('^(.*):(.*)$').exec(uriObj.auth);
  var nameDB=uriObj.pathname.substr(1);
  var mysqlPool  = mysql.createPool({
    connectionLimit : nDBConnectionLimit,
    host            : uriObj.host,
    user            : StrMatch[1],
    password        : StrMatch[2],
    database        : nameDB,
    multipleStatements: true,
    waitForConnections:true,
    queueLimit:nDBQueueLimit,
    //dateStrings:'date',
    flags:'-FOUND_ROWS'
  });
  mysqlPool.on('error',function(e){debugger});
  return mysqlPool;
}

