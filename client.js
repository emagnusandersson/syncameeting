

//butStEarlier, butStLater
//butDecCols, butIncCols

"use strict"
window.onload=function(){


var createColJIndexNamesObj=function(arrName){
  var o={};
  for(var i=0;i<arrName.length;i++){ 
    var tmp="j"+arrName[i][0].toUpperCase()+arrName[i].substr(1);       o[tmp]=i;
  }
  return o;
}

var createChildInd=function(arrI){
  var arrO=[]; for(var i=0;i<arrI.length;i++){  var itmp=arrI[i];  arrO[itmp]=i;  }  return arrO;
}

Date.prototype.dayOfYear=function(){
  var tjJan1 = new Date(this.getFullYear(),0,1);
  var daynum = Math.floor(    (   this.getTime()-tjJan1.getTime() - (this.getTimezoneOffset()-tjJan1.getTimezoneOffset())*60000   )/86400000    ) + 1;
  return daynum;
}

//
// Returns the week number for this date. 
// Parameters:
// intFirstDayOfWeek can be from 0 to 6. If intFirstDayOfWeek (0 is Sunday, 1 is Monday ...).
// intDateAlwaysInWOne is the date in January that is always in week 1 (For US: 1, for IS08601: 4)
// boRewriteWeekNames should be true if one would like to rewrite the year-shift-week to have a single name (belonging to what ever year it lies mostly in) (For US: 0, for IS08601: 1)
//
Date.prototype.getWeek = function (intFirstDayOfWeek=0,intDateAlwaysInWOne=1,boRewriteWeekNames=0) {
        // tj="javascript time", dow="day of week"
  //intFirstDayOfWeek = typeof intFirstDayOfWeek != 'undefined' ? intFirstDayOfWeek : 0; //default intFirstDayOfWeek to zero
  var tjJan1 = new Date(this.getFullYear(),0,1);
  var DOWJan1=(tjJan1.getDay()-intFirstDayOfWeek+7)%7; 
  var dayNow = Math.floor(    (   this.getTime()-tjJan1.getTime() - (this.getTimezoneOffset()-tjJan1.getTimezoneOffset())*60000   )/86400000    ) + 1;
  
  var DOWNow=DOWJan1+dayNow-1;
  var DOWDateAlwaysInW1=DOWJan1+intDateAlwaysInWOne-1;
  var weekDateAlwaysInW1Floor=Math.floor(DOWDateAlwaysInW1/7); //if one just makes a floor one gets this value
  var weekErr=1-weekDateAlwaysInW1Floor;  //Error (difference between the real value and the (erratic) floored value)

  var weeknum = Math.floor((DOWJan1+dayNow-1)/7)+weekErr;

  if(boRewriteWeekNames){
    if(weeknum >= 52) { //This "if" is for crude selection only (saves a bit com computaion though)
      var tjNextJan1 = new Date(this.getFullYear()+1,0,1);
      var DOWNextJan1 = (tjNextJan1.getDay()-intFirstDayOfWeek+7)%7;
      var dayNextNow = Math.floor(    (   this.getTime()-tjNextJan1.getTime() - (this.getTimezoneOffset()-tjNextJan1.getTimezoneOffset())*60000   )/86400000    ) + 1;  
      var dayDiff=1-dayNextNow;
      if(dayDiff<=DOWNextJan1 && DOWNextJan1<=3 ){weeknum=1; }  // If close to next year shift and (next years) Jan1 is early in the week
    }
    else if(weeknum <= 1) { //This "if" is for crude selection only (saves a bit com computaion though)
      var tjDec31 = new Date(this.getFullYear()-1,11,31);
      var weekDec31=tjDec31.getWeek(intFirstDayOfWeek,intDateAlwaysInWOne,boRewriteWeekNames);
      //var tjPrevJan1 = new Date(this.getFullYear()-1,0,1);
      //var DOWPrevJan1 = (tjPrevJan1.getDay()-intFirstDayOfWeek+7)%7;
      var dayDiff=dayNow-1;
      var daysOfWeekRemainingAtJan1=6-DOWJan1; // Week days remaining at Jan1  
      if(dayDiff<=daysOfWeekRemainingAtJan1 && DOWJan1>=3 ){weeknum=weekDec31; }  // If close to prev year shift and Jan1 is late in the week
    }
  }

  return weeknum;
};  

// Test code: t1=new Date('2008-12-27');sch.start=t1.valueOf()/1000


//
// History stuff
//

app.histGoTo=function(view){}
app.historyBack=function(){  history.back();}
app.doHistPush=function(obj){
    // Set "scroll" of stateNew  (If the scrollable div is already visible)
  var view=obj.view;
  var scrollT=window.scrollTop();
  if(typeof view.setScroll=='function') view.setScroll(scrollT); else history.StateMy[history.state.ind].scroll=scrollT;  //view.intScroll=scrollT;

  if((boChrome || boOpera) && !boTouch)  history.boFirstScroll=true;

  var indNew=history.state.ind+1;
  stateTrans={hash:history.state.hash, ind:indNew};  // Should be called stateLast perhaps
  history.pushState(stateTrans, strHistTitle, uCanonical);
  history.StateMy=history.StateMy.slice(0, indNew);
  history.StateMy[indNew]=obj;
}
app.doHistReplace=function(obj, indDiff=0){
  history.StateMy[history.state.ind+indDiff]=obj;
}
app.changeHist=function(obj){
  history.StateMy[history.state.ind]=obj;
}
app.getHistStatName=function(){
  return history.StateMy[history.state.ind].view.toString();
}
history.distToGoal=function(viewGoal){
  var ind=history.state.ind;
  var indGoal;
  for(var i=ind; i>=0; i--){
    var obj=history.StateMy[i];
    var view; if(typeof obj=='object') view=obj.view; else continue;
    if(view===viewGoal) {indGoal=i; break;}
  }
  var dist; if(typeof indGoal!='undefined') dist=indGoal-ind;
  return dist;
}
history.fastBack=function(viewGoal, boRefreshHash){
  var dist=history.distToGoal(viewGoal);
  if(dist) {
    if(typeof boRefreshHash!='undefined') history.boResetHashCurrent=boRefreshHash;
    history.go(dist);
  }
}

//
// spanMessageTextCreate
//
 
//var spanMessageTextCreate=function(){
  //var el=createElement('span');
  //var spanInner=createElement('span');
  //el.appendChild(spanInner, imgBusy)
  //el.resetMess=function(time){
    //clearTimeout(messTimer);
    //if(typeof time =='number') { messTimer=setTimeout('resetMess()',time*1000); return; }
    //spanInner.myText(' ');
    //imgBusy.hide();
  //}
  //el.setMess=function(str,time,boRot){
    //spanInner.myText(str);
    //clearTimeout(messTimer);
    //if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    //imgBusy.toggle(Boolean(boRot));
  //};
  //el.setHtml=function(str,time,boRot){
    //spanInner.myHtml(str);
    //clearTimeout(messTimer);
    //if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    //imgBusy.toggle(Boolean(boRot));
  //};
  //var messTimer;
  //el.addClass('message');//.css({'z-index':8100,position:'fixed'});
  //return el;
//}
var divMessageTextCreate=function(){
  var spanInner=createElement('span');
  var imgBusyLoc=imgBusy.cloneNode().css({zoom:'65%','margin-left':'0.4em'}).hide();
  var el=createElement('div').myAppend(spanInner, imgBusyLoc);
  el.resetMess=function(time){
    clearTimeout(messTimer);
    if(time) { messTimer=setTimeout(resetMess, time*1000); return; }
    spanInner.myText(' ');
    imgBusyLoc.hide();
  }
  el.setMess=function(str='',time,boRot){
    spanInner.myText(str);
    clearTimeout(messTimer);
    if(time)     messTimer=setTimeout(resetMess, time*1000);
    imgBusyLoc.toggle(Boolean(boRot));
  };
  el.setHtml=function(str='',time,boRot){
    spanInner.myHtml(str);
    clearTimeout(messTimer);
    if(time)     messTimer=setTimeout(resetMess, time*1000);
    imgBusyLoc.toggle(Boolean(boRot));
  };
  var messTimer;
  el.addClass('message');
  return el;
}




//
// Login stuff
//

var loginInfoToggleStuff=function(){
  var boIn=Boolean(isSetObject(userInfoFrIP));
  divLoginInfo.setStat();
  divEntryBar.visible(); // This only needed the first time really
  divEntryBar.toggle(!boIn);
  butLinkList.toggle(boIn); //butLogin.toggle(!boIn);
  //if(boIn) {linkListPop.show(); butLogin.hide();}  else {linkListPop.hide(); butLogin.show();}
}

var loginReturnList=function(){  //   after 'loginbutt'->'loginScreen' or 'delete'->'loginScreen'
  if(isSetObject(userInfoFrIP)) {var vec=[['listSchedule',{},linkListPop.listScheduleRet]]; majax(oAJAX,vec); }
}

app.loginReturn=function(userInfoFrIPT,userInfoFrDBT,fun,strMess,CSRFCodeT){
  CSRFCode=CSRFCodeT;

  var tmp=['idIP','IP','nameIP','nickIP']; userInfoFrIP={};
  for(var i=0; i<tmp.length ;i++){ userInfoFrIP[tmp[i]]=userInfoFrIPT[tmp[i]];   }
  
  var tmp=['idUser','IP','idIP','nameIP','nickIP','created'];
  if(typeof userInfoFrDBT.customer == 'undefined' || typeof userInfoFrDBT.customer == 'unknown' || typeof userInfoFrDBT.customer == 'number') {}else{
    userInfoFrDB.customer={};
    for(var i=0; i<tmp.length ;i++){ userInfoFrDB.customer[tmp[i]]=userInfoFrDBT.customer[tmp[i]];   }   
  }
  
  resetMess();
  loginInfoToggleStuff();
  loginPop.closeFunc();

  if(loginReturn2) loginReturn2();
}

var loginPopExtend=function(el){
  el.toString=function(){return 'loginPop';}
  var popupWin=function(IP,openid) {
    //e.preventDefault();
    pendingMess.show(); cancelMess.hide();
    
    //var strFile='loginStart.php';
    var strFile=leafLogin;
    //var arrQ=['IP='+IP, 'fileReturn='+encodeURIComponent(leafLogin+'?fun='+strType+'Fun')];
    var strType='customer'
    var arrQ=['IP='+IP, 'fileReturn='+leafLogin,'fun='+strType+'Fun'];
    if(IP==='openid') arrQ.push('openid_identifier='+encodeURIComponent(openid));
    var uPop=strFile+'?'+arrQ.join('&');
    el.win=window.open(uPop, 'popup', 'width=580,height=400');

    clearInterval(timerClosePoll);
    timerClosePoll = setInterval(function() { if(el.win.closed){ clearInterval(timerClosePoll); pendingMess.hide(); cancelMess.show(); }  }, 500);  
    return 0;
  }

  el.openFunc=function(){
    pendingMess.hide(); cancelMess.hide(); 
    doHistPush({view:loginPop});
    el.setVis();
  }
  el.setHead=function(str){head.myText(str); return el;}
  el.setVis=function(){ el.show();  return true;}
  el.closeFunc=function(){ clearInterval(timerClosePoll); historyBack();}
  var timerClosePoll;
  
  //el.css({'max-width':'20em', padding: '1.2em 0.5em 1.2em 1.2em'});  
  //el.css({ width:'25em', padding: '1.2em'});  
  
  var strType;
  
  var headHelp=imgHelp.cloneNode(1).css({'margin-left':'1em'}),  bub=createElement('div').myHtml(langHtml.loginPop.headHelp);     popupHover(headHelp,bub);  
  var head=createElement('span').myAppend(langHtml.loginPop.loginMethods);
  var pHead=createElement('p').myAppendHtml(head,headHelp);

  
  var strButtonSize='3em';
  var fbIm=createElement('img').on('click', function(){popupWin('fb','');}).prop({src:uFB, alt:"fb"}).css({position:'relative',top:'0.4em'}); //,width:strButtonSize,heigth:strButtonSize
  var fbHelp=imgHelp.cloneNode(1).css({margin:'0 0 0 1em'}),  bub=createElement('div').myHtml(langHtml.loginPop.fbComment);     popupHover(fbHelp,bub);  

  var googleIm=createElement('img').prop({src:uGoogle, alt:"google"}).on('click', function(){popupWin('google','');}).css({position:'relative',top:'0.4em',width:strButtonSize,heigth:strButtonSize,'margin-left':'1em'}); 

  var openIDIm=createElement('img').prop({src:uOID22, alt:"openID"}).css({position:'relative',top:'0.4em',width:strButtonSize,heigth:strButtonSize,'margin-left':'1em',background:'white'}); 
  openIDIm.on('click', function(){p2.toggle();});
  var p1=createElement('p').myAppend(fbIm).css({'text-align':'center'}); // ,googleIm,openIDIm

  var cancel=createElement('button').on('click', historyBack).myText(langHtml.Cancel);//.css({'margin-top':'1.5em'});
  //if(boSharp) p2='';
  [p1,cancel].forEach(ele=>ele.css({'margin-top':'1.5em'})); // p2  , 'margin-right':'1.5em'
  
  var pendingMess=createElement('span').hide().myAppend(langHtml.loginPop.pendingMess,' ',imgBusy.cloneNode());
  var cancelMess=createElement('span').hide().myAppend(langHtml.loginPop.cancelMess);
  
  //el.append(pHead,p1,cancel,pendingMess,cancelMess);  //,p2
  //el.css({'text-align':'left'});
  
  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').myAppend(pHead,p1,cancel,pendingMess,cancelMess);
  centerDiv.addClass("Center").css({padding: '1em 0.8em 1em 0.8em'}); //'width':'21em', height:'12em', 
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //

  return el;

}

var divEntryBarExtend=function(el){
  //var cssBut={width:'initial','font-weight':'bold', padding:'0.2em', height:"auto", 'min-height':'1.8rem'};
  var butLogin=createElement('button').css({flex:'0 0 auto'}).myText('Login').on('click', function(){loginReturn2=loginReturnList; loginPop.openFunc();});
  el.css({ display:"flex", "justify-content":"center", 'align-items':'center'}); //, 'border-top':'solid 1px', "justify-content":"space-evenly"
  el.myAppend(butLogin);
  return el;
}


var divLoginInfoExtend=function(el){
  el.setStat=function(){
    var boShow=0,arrKind=[];
    var boShow=isSetObject(userInfoFrIP);
    if(boShow){ spanName.myText(userInfoFrIP.nameIP); }
    el.toggle(boShow);
  }
  var spanName=createElement('span'), spanKind=createElement('span').css({'margin-left':'.4em', 'margin-right':'0.4em'});
  var logoutButt=createElement('button').myText(langHtml.divLoginInfo.logoutButt).css({'margin-left':'auto'});//.css({'float':'right','font-size':'90%'});
  logoutButt.on('click', function(){ 
    userInfoFrIP={}; 
    var vec=[['logout']];   majax(oAJAX,vec); 
    return false;
  });
  
  el.myAppend(spanName,spanKind,logoutButt).css({display:'flex', 'justify-content':'space-between', 'align-items':'center', 'font-size':'12px'});
  el.hide();
  //el.css({visibility:'hidden'});
  return el;
}






//
// linkCreatedPop
//

var linkCreatedPopExtend=function(el){
  el.toString=function(){return 'linkCreatedPop';}
  el.setVis=function(){ el.show();  return true;}
  el.setup=function(uuid){
    const strLink=uFE+'?uuid='+uuid;
    //aMeetingLink.prop({href:strLink}).myText(strLink);
    textLink.value=strLink;
  }
  var butClose=createElement('button').myText("Close").on('click', historyBack);
  //var aMeetingLink=createElement('a').css({display:'block', 'word-break':'break-all', 'font-size':'85%', margin:'0.4em 0 0.9em'});
  var textLink=createElement('textarea').css({display:'block', 'word-break':'break-all', 'font-size':'85%', margin:'0.4em 0 0.9em', width:"100%", height:"4em","box-sizing":"border-box", resize:"none"}).attr({readonly:'readonly'});
  var divA=createElement('div').myAppend("Send this link to all meeting participants:");


  var butCopy=createElement('button').myText('Copy to clipboard').css({'font-size':'85%', display:'block', 'margin-bottom':'1.3em'}).on('click',function(){    textLink.select(); textLink.setSelectionRange(0, 99999); document.execCommand("copy");  });

  
  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').myAppend(divA, textLink, butCopy, butClose); //aMeetingLink
  centerDiv.addClass("Center").css({padding: '1em 0.8em 1em 0.8em'}); 
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //
  return el;
}



//
// settingPop
//

var unitSelectorExtend=function(el){
  el.setUpButtStat=function(){
    var tmp="input[value='"+sch.unit+"']";
    el.querySelector(tmp).attr({checked:1});
  }
  var changeCB=function(){
    //sch.setUnit(u);
    var u=this.value;
    sch.unit=u; sch.setDefaultFilters(); settingPop.setFilterUI();
    var startN=sch.calcStart(0,u), vTimeN=sch.calcVTime(startN,'',20,0,0);
    sch.convertMTab(u,vTimeN);  sch.unit=u; sch.vTime=vTimeN;
    sch.M2Table();
    return 0;
  }
  el.empty();
  var butL=createElement('input').attr({type:'radio',name:'unit'}).prop('value','l').on('change', changeCB);
  var butH=createElement('input').attr({type:'radio',name:'unit'}).prop('value','h').on('change', changeCB);
  var butD=createElement('input').attr({type:'radio',name:'unit'}).prop('value','d').on('change', changeCB);
  var butW=createElement('input').attr({type:'radio',name:'unit'}).prop('value','w').on('change', changeCB);
  var divLabel=createElement('div').myText('Calender resolution:').css({'font-weight':'bold'});
  el.myAppend(divLabel ,butL,'lectures ',butH,'hours ',butD,'days ',butW,'weeks');
  return el;
}

var lectureFilterExtend=function(el){
  el.setUpSel=function(){
    var iSel=0;
    for(var i=0;i<nLec;i++){
      if(sch.hFilter[i]) iSel=i;
    }
    //var o=el.find('option:eq('+(iSel-1)+')'); 
    var o=sel[iSel-1];  // This looks a bit ugly, but I think it works because iSel will never be 0. (sch.hFilter[0] will always be 0)
    o.attr('selected', 1);
  }
  var nLec=10;
  var sel=createElement('select');
  for(var i=0;i<nLec;i++){  
    var opt=createElement('option').prop('value',i+1).myText(i+1);
    sel.append(opt);
  }
  sel.on('change', function(){
    var arrtmp=[], tmp=sel.value;
    for(var i=0;i<24;i++) {if(i>=1 && i<=tmp) arrtmp[i]=1; else arrtmp[i]=0;}; 
    sch.hFilter=arrtmp;
    var vTimeN=sch.calcVTime(sch.start,'','',0,0);
    sch.convertMTab('',vTimeN);   sch.vTime=vTimeN;   sch.M2Table();
    el.setUpSel();
  });
  var spanLabel=createElement('span').myText('Number of lectures per day: ').css({'font-weight':'bold'});
  el.append(spanLabel,sel);
  
  return el;
}

var hourFilterExtend=function(el){
  el.setUpButtStat=function(){
    for(var i=0;i<24;i++){
      //var b=el.children('button:eq('+i+')');
      var b=arrButt[i];
      if(sch.hFilter[i]==1) b.css(el.colOn); else b.css(el.colOff);
    }
  }
  el.colOn={background:'#4f4'};el.colOff={background:'#eee'};
  var clickCB=function(){
    var i=this.myVal;
    sch.hFilter[i]=1-sch.hFilter[i]; 
    var anyOn=0; for(var j=0;j<sch.hFilter.length;j++){if(sch.hFilter[j]==1) anyOn=1;} 
    if(anyOn==0) {sch.hFilter[i]=1-sch.hFilter[i]; } // At least one has to be 'on'

    var vTimeN=sch.calcVTime(sch.start,'','',0,0);
    sch.convertMTab('',vTimeN);   sch.vTime=vTimeN;   sch.M2Table();
    el.setUpButtStat();
  } 
  var spanLabel=createElement('span').myText('Only include certain hours: ').css({'font-weight':'bold'});
  el.append(spanLabel);
  var arrButt=Array(24);
  for(var i=0;i<24;i++){ var but=createElement('button').myText(i).prop({myVal:i}).on('click', clickCB);  arrButt[i]=but; el.append(but);}
  
  return el;
}

var dayFilterExtend=function(el){
  el.setUpButtStat=function(){
    for(var i=0;i<7;i++){
      //var b=el.children('button:eq('+i+')');
      var b=arrButt[i];
      if(sch.dFilter[i]==1) b.css(el.colOn); else b.css(el.colOff);
    }
  }
  var clickCB=function(){
    var i=this.myVal;
    sch.dFilter[i]=1-sch.dFilter[i]; 
    var anyOn=0; for(var j=0;j<7;j++){if(sch.dFilter[j]==1) anyOn=1;} 
    if(anyOn==0) {sch.dFilter[i]=1-sch.dFilter[i]; } // At least one has to be 'on'
    if(sch.dFilter[i]) this.css(el.colOn); else this.css(el.colOff);
    var vTimeN=sch.calcVTime(sch.start,'','',0,0);
    sch.convertMTab('',vTimeN);   sch.vTime=vTimeN;   sch.M2Table();
  } 
  el.colOn={background:'#4f4'};el.colOff={background:'#eee'};
  var divLabel=createElement('div').myText('Mark the week days to be included: ').css({'font-weight':'bold'});
  el.append(divLabel);
  var arrButt=Array(7);
  for(var i=0;i<7;i++){ var but=createElement('button').myText(arrDayName[i]).prop({myVal:i}).css({'margin-right':'0.70em', width:'1.5em', padding:'1px 0'}).on('click', clickCB);  arrButt[i]=but;  el.append(but);}
  return el;
}

var divFirstDayOfWeekExtend=function(el){
  el.setUp=function(i){
    //var o=el.find('option:eq('+i+')'); 
    var o=sel[i]; 
    o.attr('selected', 1);
  }
  var sel=createElement('select').css({'font-size':'95%', 'letter-spacing':'-0.05em'}).on('change', function(){
    sch.intFirstDayOfWeek=Number(sel.value); 
    sch.M2Table();});
  var arrWeekDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  for(var i=0;i<arrWeekDays.length;i++) {
    var opt=createElement('option').prop('value',i).myText(arrWeekDays[i]); sel.append(opt);
  }
  //sel.children('option:eq(1)').attr('selected', 1);
  sel[1].selected=1; 
  var spanLabel=createElement('span').myText('First day of the week: ').css({'font-weight':'bold'});
  el.append(spanLabel,sel);
  return el;
}

var divDateAlwaysInWOneExtend=function(el){
  el.setUp=function(i){
    var o=el.querySelector("[type='radio'][value='"+i+"']"); 
    o.attr('checked', true);
  }
  var changeCB=function(){
    var d=this.value;
    sch.intDateAlwaysInWOne=Number(d);    sch.M2Table(); return 0;
  }
  var elR0=createElement('input').attr({type:'radio',name:'intDateAlwaysInWOne'}).prop('value',1).on('change', changeCB);
  var elR1=createElement('input').attr({type:'radio',name:'intDateAlwaysInWOne'}).prop('value',4).on('change', changeCB);
  
  
  var spanLabel=createElement('span').myAppend('Week numbering: ').css({'font-weight':'bold'});
  var d0=createElement('div').myAppend(elR0,"Week #1 is the week that contains Jan 1 (used in America, Asia ...)");
  var d1=createElement('div').myAppend(elR1,"Week #1 is the first week that mainly lies in the new year (the week that contains Jan 4) (used in some EU countries)");
  var tmp=[d0,d1]; tmp.forEach(ele=>ele.css({margin:'1em 0'}));
  el.append(spanLabel, ...tmp);
  elR1.attr('checked',1);
  return el;
}

var settingPopExtend=function(el){
  el.toString=function(){return 'settingPop';}
  
  el.setFilterUI=function(){
    lectureFilter.hide(); hourFilter.hide(); dayFilter.hide();
    if(sch.unit=='l') {  lectureFilter.show();  lectureFilter.setUpSel();  }  
    else if(sch.unit=='h') {  hourFilter.show();  hourFilter.setUpButtStat();  } 

    if(sch.unit=='l' || sch.unit=='h' || sch.unit=='d') {dayFilter.show(); dayFilter.setUpButtStat(); } 

    divFirstDayOfWeek.setUp(sch.intFirstDayOfWeek);
    divDateAlwaysInWOne.setUp(sch.intDateAlwaysInWOne);
    unitSelector.setUpButtStat(); 
  }
  
  //✖
  var butClose=createElement('button').myText('≪').css({margin:'0em', position:'absolute', right:'0%', 'font-size':'inherit', transform:'translateX(50%)', bottom:'0.5em'}).on('click', historyBack); //, 'border-radius':'50%', border:'solid 1px grey'
  //var divClose=createElement('div').myAppend(butClose).css({ display:'flex', 'flex-direction':'row-reverse'});

  var unitSelector=unitSelectorExtend(createElement('div'));   
  var dayFilter=dayFilterExtend(createElement('div'));  
  var lectureFilter=lectureFilterExtend(createElement('div'));  
  var hourFilter=hourFilterExtend(createElement('div')); 
  //boxWeek=boxWeekExtend(createElement('div'));  
  var divFirstDayOfWeek=divFirstDayOfWeekExtend(createElement('div'));  
  var divDateAlwaysInWOne=divDateAlwaysInWOneExtend(createElement('div'));  


  el.setFilterUI();  //hourFilter.setUpButtStat();  dayFilter.setUpButtStat();

  var tmp=[unitSelector, dayFilter, divFirstDayOfWeek, divDateAlwaysInWOne, lectureFilter, hourFilter];  // titleInp , peroidDiv
  tmp.forEach(ele=>ele.css({'margin':'1em 0.4em 1em 0.4em'}));
  unitSelector.css({'margin':'1.5em 0.4em 1em 0.4em'})
  //titleInp.css({'margin-top':'0em'});
  //divClose.css({'margin':'0em'});
  //el.append(...tmp);
  var divCont=createElement('div').addClass('contDiv').myAppend(...tmp);
  var divFoot=createElement('div').myAppend(butClose).addClass('footDiv').css({'justify-content':'center', 'align-items':'flex-end', height:'0px', padding:'0em', 'border-top':'0px', 'font-size':'1.5em'}); //,overflow:'hidden'
  

  el.divContW=createElement('div').myAppend(divCont, divFoot).css({display:'flex', 'flex-direction':'column'});
  el.divBlanket=divBlanket.cloneNode().on('click', historyBack).hide();
  
  //var divContW=createElement('div').css({display:'flex', 'flex-direction':'column'}).myAppend(divCont, divFoot);
  el.append(el.divContW, el.divBlanket);
  return el;
}


//
// linkListPop
//

var deleteScheduleConfirmPopExtend=function(el){
  el.toString=function(){return 'deleteScheduleConfirmPop';}
  el.setVis=function(){ el.show();  return true;}
  el.setup=function(uuidRowT){uuidRow=uuidRowT;}
  el.yes=createElement('button').myText('Yes').on('click', function(){
    var vec=[['deleteSchedule',{uuid:uuidRow},linkListPop.deleteScheduleRet],['listSchedule',{},linkListPop.listScheduleRet]];   majax(oAJAX,vec);
    if(uuidRow===uuid) uuid='';
    historyBack();
  });
  var uuidRow;
  var cancel=createElement('button').myText("Cancel").on('click', historyBack);
  var divA=createElement('div').myText("Do you really want to delete this schedule?").css({'margin-bottom':'0.5em'});
  
  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').myAppend(divA,el.yes,cancel);
  centerDiv.addClass("Center").css({padding: '1em 0.8em 1em 0.8em'}); 
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //
  return el;
}

var linkListPopExtend=function(el){
  el.toString=function(){return 'linkListPop';}
  var deleteFunc=function(){
    var {myUUID}=this.parentNode.parentNode;
    if(isSetObject(userInfoFrIP)){
      deleteScheduleConfirmPop.setup(myUUID); deleteScheduleConfirmPop.setVis(); deleteScheduleConfirmPop.yes.focus(); doHistPush({view:deleteScheduleConfirmPop});
    }
    else {
      loginReturn2=loginReturnList;
      loginPop.openFunc();
    }
  }
  el.deleteScheduleRet=function(data){
    //if(data.nRemaining==0) historyBack();
  }
  el.listScheduleRet=function(data){
    //return;
    if(typeof data=='undefined') return;
    var tmp=data.tab;   if(typeof tmp==="undefined") tmp=[]; tab=tmp; el.tab=tab;
    tbody.empty();
    
    for(var i=0;i<tab.length;i++){   
      var uuid=tab[i][jUuid];
      var tmp=uFE+'?uuid='+uuid;



      var textLink=createElement('textarea').css({display:'block', 'word-break':'break-all', 'font-size':'85%', width:"100%", height:"4em","box-sizing":"border-box", resize:"none"}).prop({value:tmp}).attr({readonly:'readonly'}); //, margin:'0.4em 0 0.9em'
    
      var butCopy=createElement('button').myText('Copy').css({'font-size':'85%'}).on('click',function(){  
        var textAreaTmp=this.parentElement.parentElement.children[2].firstChild;
        textAreaTmp.select(); textAreaTmp.setSelectionRange(0, 99999); document.execCommand("copy");  });
      var butGoTo=createElement('button').myText('Goto').css({'font-size':'85%'}).on('click',function(){    
        window.location.href = this.parentElement.parentElement.children[2].firstChild.value;  });



      var del=createElement('div').myText('✖').css(cssDeleteButtonMouseOut).css({cursor:'pointer', 'font-size':'1.5em'}).on('click', deleteFunc)
                .on('mouseover', function(){this.css(cssDeleteButtonMouseOver);}).on('mouseout', function(){this.css(cssDeleteButtonMouseOut);});
      var tdDel=createElement('td').myAppend(del).css({'vertical-align':'middle', 'padding':'0.2em 0.4em'}).prop({'title':'Delete'});
      var tdTitle=createElement('td').myAppend(tab[i][jTitle]).css({'word-break':'break-word'});
      var tdLink=createElement('td').myAppend(textLink);
      var tdCopy=createElement('td').myAppend(butCopy);
      var tdGoTo=createElement('td').myAppend(butGoTo);
      //var tdCopy=createElement('td').myAppend();
      var arrRow=[tdDel, tdTitle, tdLink, tdCopy, tdGoTo, createElement('td').myAppend(swedDate(tab[i][jCreated])), createElement('td').myAppend(swedDate(tab[i][jLastActivity]))];
      var tr=createElement('tr').myAppend(...arrRow).prop({myUUID:uuid});
      tbody.append(tr);
    }
    //table.toggle(Boolean(tab.length));
    loginInfoToggleStuff();
    //var Td=tbody.querySelectorAll('td:nth-child(1)'); Td.forEach(ele=>ele.css({'padding':'0 0.4em'}));
  
    spanLinkList.myText(tab.length);
  }
  var tab=[]; el.tab=tab;
  var arrRow=[createElement('th'), createElement('th').myText('Title'), createElement('th').myText('Link to send to the meeting participants.').attr({colspan:3}), createElement('th').myText('Cre­at­ed'), createElement('th').myText('Last act­ivity')];
  arrRow.forEach(ele=>ele.css({'word-break':'keep-all'}));
  var elRow=createElement('tr').myAppend(...arrRow), thead=createElement('thead').myAppend(elRow);
  var caption=createElement('caption').myText('Saved meetings').attr("contenteditable", "true");
  var tbody=createElement('tbody');
  var table=createElement('table').myAppend(caption, thead, tbody).css({'font-size':'100%'});
  //el.append(table);
  
  var butClose=createElement('button').myText('≪').css({margin:'0em', position:'relative', right:'-50%', 'font-size':'inherit', bottom:'0.5em'}).on('click', historyBack);
  var divCont=createElement('div').addClass('contDiv').myAppend(table);
  var divFoot=createElement('div').myAppend(butClose).addClass('footDiv').css({'justify-content':'center', 'align-items':'flex-end', height:'0px', padding:'0em', 'border-top':'0px', 'font-size':'1.5em'}); //,overflow:'hidden'
  
  el.divContW=createElement('div').myAppend(divCont, divFoot).css({display:'flex', 'flex-direction':'column'});
  el.divBlanket=divBlanket.cloneNode().on('click', historyBack).hide();
  
  el.append(el.divContW, el.divBlanket);
  return el;
}





/*******************************************************************************************************************
 * scheduleExtend
 *******************************************************************************************************************/




var scheduleExtend=function(el){
  var dayStart=function(tu){
    var tj=new Date(tu*1000),st=Number(tj.setHours(0,0,0,0))/1000; return st; }
  var weekStart = function(tu) {
    var tj=new Date(tu*1000);
    var DOW=(tj.getDay()-el.intFirstDayOfWeek+7)%7;
    var st=Number(tj.setHours(0,0,0,0))/1000 - DOW*24*60*60;     
    return st;
  }
  
  el.calcStart=function(tApprox,unit){
    if(tApprox===0) {var tmp=new Date(); tApprox=tmp/1000;} 
    if(unit=='w') tmp=weekStart(tApprox); else tmp=dayStart(tApprox); return tmp;
  }

  el.M2Table=function(){
    tbody.empty().detach();
    //var fragment = document.createDocumentFragment();
    
    if(el.vTime!=null) {
      const tmpCssW={position:'relative'};
      var elRY=createElement('tr').myAppend(createElement('th').myAppend('Year')), elRM=createElement('tr').myAppend(createElement('th').myText('Month')), elRD=createElement('tr').myAppend(createElement('th').myText('Date'));
      var elRW=createElement('tr').myAppend(createElement('th').myText('Week')), elRN=createElement('tr').myAppend(createElement('th').myText('Day')), elRH=createElement('tr').myAppend(createElement('th').myText('Hour'));
      if(el.unit=='l') elRH.children[0].myText('Lecture');
      var tHl='', tNl='', tWl='', tDl='', tMl='', tYl='';
      var cSpanH=1,cSpanN=1,cSpanW=1,cSpanD=1,cSpanM=1,cSpanY=1;
      for(var j=0;j<el.vTime.length;j++) { 
        var tmp,t=new Date(el.vTime[j]*1000);
        var boRewriteWeekNames=0; if(el.intDateAlwaysInWOne==4) {boRewriteWeekNames=1;}
        var tH=t.getHours(), tN=arrDayName[t.getDay()], tW=t.getWeek(el.intFirstDayOfWeek,el.intDateAlwaysInWOne,boRewriteWeekNames), tD=t.getDate(), 
            tM=arrMonthName[t.getMonth()], tY=t.getFullYear();
        if(tH!==tHl) {var hH=createElement('th').myText(tH); elRH.append(hH);cSpanH=1;} else {cSpanH++;hH.attr({colspan:cSpanH});}
        if(tN!==tNl) {var hN=createElement('th').myText(tN); elRN.append(hN);cSpanN=1;} else {cSpanN++;hN.attr({colspan:cSpanN});}
        if(tW!==tWl) {var hW=createElement('th').myText(tW); elRW.append(hW);cSpanW=1;} else {cSpanW++;hW.attr({colspan:cSpanW});}
        if(tD!==tDl) {var hD=createElement('th').myText(tD); elRD.append(hD);cSpanD=1;} else {cSpanD++;hD.attr({colspan:cSpanD});}
        if(tM!==tMl) {var hM=createElement('th').myText(tM); elRM.append(hM);cSpanM=1;} else {cSpanM++;hM.attr({colspan:cSpanM});}
        if(tY!==tYl) {var hY=createElement('th').myText(tY); elRY.append(hY);cSpanY=1;} else {cSpanY++;hY.attr({colspan:cSpanY});}
        tHl=tH;tNl=tN;tWl=tW;tDl=tD;tMl=tM;tYl=tY;
      }
      if(el.unit=='d') elRH='';
      if(el.unit=='w') {elRD=''; elRN=''; elRH='';}
      //elRY.children[0].css(tmpCssW).prepend(butStart);
      elRY.children[0].css(tmpCssW).prepend(butStEarlier);
      elRY.children[1].css(tmpCssW).append(butStLater);
      elRY.lastChild.css(tmpCssW).myAppend(butDecCols);
      elRY.append(createElement('th').css(tmpCssW).css({'border-color':'transparent'}).myHtml('&nbsp;').myAppend(butIncCols));
      thead.empty().append(elRY,elRM,elRD,elRW,elRN,elRH);
    }
    var keyUpFunc=function(){var {iMy}=this.parentNode.parentNode; el.vNames[iMy]=this.value;}
    if(el.MTab!=null && el.vNames!=null) {
      for(var i=0;i<el.MTab.length;i++) {
        
        var del=createElement('div').myAppend('✖').css(cssDeleteButtonMouseOut).css({cursor:'pointer', 'font-size':'1.5em', display:'inline-block','margin':'0 0.3em'}).on('click', removePersonFunc)
                .on('mouseover', function(){this.css(cssDeleteButtonMouseOver);}).on('mouseout', function(){this.css(cssDeleteButtonMouseOut);});
        var input=createElement('input').prop({type:'text', placeholder:"Name"}).prop('value',el.vNames[i]).on('keyup', keyUpFunc);
        
        var row=createElement('tr').prop({iMy:i}),td=createElement('td').myAppend(del,' ',input).css({'white-space':'nowrap'});
        row.append(td); 
        for(var j=0;j<el.MTab[i].length;j++) { 
          var tmp,eTmp=el.MTab[i][j];
          if(eTmp==enumY) tmp='lightgreen'; else if(eTmp==enumN) tmp='red'; else tmp='';
          var td=createElement('td').css({'background-color':tmp}).prop({iMy:i, jMy:j}).on('click', cellClickFunc);
          //td.myState=eTmp;
          
          row.append(td); 
        }
        tbody.append(row);
      }
    }
    var button=createElement('button').myText('+').on('click', addPerson).prop({title:'Add name'}).css({'font-size':'120%'}), td=createElement('td').css({'text-align':'center'}).myAppend(button), row=createElement('tr').myAppend(td);

    tbody.append(row);
    elTable.append(tbody);
  }
  
  var addPerson=function(){
    var nRows=el.MTab.length,nCols=el.vTime.length;
    var arrTmp=[]; for(var j=0;j<nCols;j++){arrTmp[j]=enumVoid;}
    el.MTab.push(arrTmp); el.vNames.push('');   el.M2Table();
  }
  
  var removePersonFunc=function(){
    var {iMy}=this.parentNode.parentNode;
    var nRows=el.MTab.length,nCols=el.vTime.length, nRowsN=nRows-1;
    var MTabN=[], vNamesN=[];
    for(var i=0;i<nRows;i++){ 
      if(i!=iMy){
        MTabN.push(el.MTab[i]);
        vNamesN.push(el.vNames[i]);
      }
    }
    el.MTab=MTabN;el.vNames=vNamesN;   el.M2Table();
  }
  var cellClickFunc=function(){
    var {iMy,jMy}=this;
    var eTmp=(el.MTab[iMy][jMy]+1)%2, tmp;
    el.MTab[iMy][jMy]=eTmp;      
    if(eTmp==enumY) tmp='lightgreen'; else if(eTmp==enumN) tmp='red'; else tmp='';
    this.css({'background-color':tmp});
  }
   

  el.calcVTime= function(startN,unitN,nCols,nStChange,nColsChange){ 
    var vTimeN=[], endN;
    if(startN==='') startN=el.vTime[0];
    if(unitN==='') unitN=el.unit;
    var dirStChange=nStChange>0?1:-1, absStChange=Math.abs(nStChange);
    var iChange=0;
    var startT=new Date(startN*1000);
    
    
      // Adjust startN based on nStChange
    var iAvoidInfiniteLoop=0;
    while(1){ 
      var hour=startT.getHours(), day=startT.getDay();
      var boTmp1=el.hFilter[hour] || (unitN=='d' || unitN=='w');
      var boTmp2=el.dFilter[day] || unitN=='w';
      if(boTmp1 && boTmp2) { if(iChange==absStChange){ startN=startT/1000; break;} else iChange++;} 

      if(unitN=='h' || unitN=='l') { startT.setHours(startT.getHours()+dirStChange); }
      else if(unitN=='d') { startT.setDate(startT.getDate()+dirStChange); }
      else if(unitN=='w') { startT.setDate(startT.getDate()+dirStChange*7); }
      if(iAvoidInfiniteLoop>10000) debugger;
    }
    el.start=startN;

      // Add nCols+nColsChange entries to vTimeN
    if(nCols==='') nCols=el.MTab[0].length; nCols+=nColsChange; if(nCols<0) nCols=0;
    var startT=new Date(startN*1000);
    iAvoidInfiniteLoop=0;
    while(1){ 
      var hour=startT.getHours(), day=startT.getDay();
      var boTmp1=el.hFilter[hour] || (unitN=='d' || unitN=='w');
      var boTmp2=el.dFilter[day] || unitN=='w';
      if ( boTmp1 && boTmp2) { var tmp=startT/1000; vTimeN.push(tmp); if(vTimeN.length>=nCols){endN=tmp;break;}} 

      if(unitN=='h' || unitN=='l') { startT.setHours(startT.getHours()+1); }
      else if(unitN=='d') { startT.setDate(startT.getDate()+1); }
      else if(unitN=='w') { startT.setDate(startT.getDate()+7); };
      if(iAvoidInfiniteLoop>10000) debugger;
    }
    return vTimeN;
  }

  el.convertMTab= function(unitN,vTimeN){  //el.unit, el.hFilter, el.dFilter   => el.start, vTime, el.MTab, 
    var nRows=el.MTab.length;
    var MTabN=[], nColsN=vTimeN.length;   
    if(unitN==='') unitN=el.unitN;
    if(unitN==el.unitN){      
      for(var i=0;i<nRows;i++){ 
        MTabN[i]=[];
        for(var j=0;j<nColsN;j++){
          var tmp=vTimeN[j];
          var jO=el.vTime.indexOf(tmp); 
          if(jO!=-1) tmp=el.MTab[i][jO]; else tmp=enumVoid;   MTabN[i][j]=tmp;    
        }
      }
    }else{
      for(var i=0;i<nRows;i++){  MTabN[i]=[];  for(var j=0;j<nColsN;j++){MTabN[i][j]=enumVoid;}  }
    }
    el.MTab=MTabN;
  }
  el.setDefaultHFilter=function(){for(var i=0;i<24;i++){el.hFilter[i]=0;  if(i>=8 && i<=16) el.hFilter[i]=1;}  }
  el.setDefaultHFilterL=function(){for(var i=0;i<24;i++){el.hFilter[i]=0;  if(i>=1 && i<=8) el.hFilter[i]=1;}  }
  el.setDefaultDFilter=function(){for(var i=0;i<7;i++){el.dFilter[i]=0;  if(i>=1 && i<=5) el.dFilter[i]=1;}  }
  el.setDefaultFilters=function(){
    if(el.unit=='l') { el.setDefaultHFilterL();}    else if(el.unit=='h') {el.setDefaultHFilter(); } 
    if(el.unit=='l' || el.unit=='h' || el.unit=='d') {el.setDefaultDFilter();} 
  }
  
  el.save=function(e){
    //e.stopPropagation();
    if(isSetObject(userInfoFrIP) || uuid)     {
      var o={unit:el.unit, intFirstDayOfWeek:el.intFirstDayOfWeek, intDateAlwaysInWOne:el.intDateAlwaysInWOne, start:el.start, lastActivity:lastActivity};
      if(uuid!==null) o.uuid=uuid;
      o.title=inpTitle.value.trim();
      o.MTab=JSON.stringify(sch.MTab);
      o.vNames=JSON.stringify(sch.vNames);
      o.hFilter=JSON.stringify(sch.hFilter);
      o.dFilter=JSON.stringify(sch.dFilter);
      setMess('saving',10,1);
      var vec=[['saveSchedule', o, saveScheduleRet],['listSchedule',{},linkListPop.listScheduleRet]]; 
      majax(oAJAX,vec);  
    }
    else {
      loginReturn2=function(){
        sch.save();
      }
      loginPop.openFunc();
    }
  }
  var saveScheduleRet=function(data){
    var uuidO=uuid;
    uuid=data.uuid;
    lastActivity=data.lastActivity;
    
    if(!uuidO && uuid) {
      linkCreatedPop.setup(uuid); linkCreatedPop.setVis(); doHistPush({view:linkCreatedPop});
    }
  }

  
  el.getScheduleRet=function(data){
    var row=data.row;
    for(var k in row){
      if(k!='uuid' && k!='unit' && k!='title') {
        var data; try{ data=JSON.parse(row[k]); }catch(e){ setMess(e);  return; }
        row[k]=data;
      }
    }
    if(typeof row!=='undefined') {
      uuid=row.uuid;
      lastActivity=row.lastActivity;
      inpTitle.value=row.title;
      copySome(el, row, ['MTab', 'unit', 'intFirstDayOfWeek', 'intDateAlwaysInWOne', 'start', 'vNames', 'hFilter', 'dFilter']);
    } else row=[]; 

    el.start=el.calcStart(el.start,el.unit);
    el.vTime=el.calcVTime(el.start,'','',0,0);
    settingPop.setFilterUI();
    el.M2Table();
  }
  el.revert=function(){
    if(uuid) vec[2]=['getSchedule',{uuid:uuid},el.getScheduleRet];   majax(oAJAX,vec); 
  }


  el.inputTitle=createElement('input').prop({'type':'text', placeholder:"Title"});
  el.butTitle=createElement('button').myAppend('✎');
  //el.caption=createElement('caption').myAppend(el.inputTitle, el.butTitle);
  var elTable=createElement('table');;
  var tbody=createElement('tbody'), thead=createElement('thead');
  elTable.append(thead,tbody);
  el.append(elTable);
  
  el.hFilter=[],el.dFilter=[],el.MTab=[],el.vNames=[],el.intFirstDayOfWeek=1,el.intDateAlwaysInWOne=4,el.unit='d';
  
  for(var i=0;i<24;i++){el.hFilter[i]=0;  if(i<16 && i>=8) el.hFilter[i]=1;}
  for(var i=0;i<7;i++){el.dFilter[i]=0;  if(i>=1 && i<=5) el.dFilter[i]=1;}

  el.MTab=[];el.vNames=[];
  for(var i=0;i<5;i++){
    el.vNames[i]=""; el.MTab[i]=[];
    for(var j=0;j<14;j++){ el.MTab[i][j]=enumVoid; }
  }
  var tmp=new Date();
  el.start=el.calcStart(tmp/1000,el.unit);
  el.vTime=el.calcVTime(el.start,'','',0,0);
  el.M2Table();

  return el;
}



/*******************************************************************************************************************
 * LoadTab-callbacks
 *******************************************************************************************************************/


var majax=function(trash, vecIn){  // Each argument of vecIn is an array: [serverSideFunc, serverSideFuncArg, returnFunc]
  var xhr = new XMLHttpRequest();
  xhr.open('POST', uBE, true);
  xhr.setRequestHeader('X-Requested-With','XMLHttpRequest'); 
  var arrRet=[]; vecIn.forEach(function(el,i){var f=null; if(el.length==3) f=el.pop(); arrRet[i]=f;}); // Put return functions in a separate array
  vecIn.push(['CSRFCode',CSRFCode]);
  if(vecIn.length==2 && vecIn[0][1] instanceof FormData){
    var formData=vecIn[0][1]; vecIn[0][1]=0; // First element in vecIn contains the formData object. Rearrange it as "root object" and add the remainder to a property 'vec'
    formData.append('vec', JSON.stringify(vecIn));
    var dataOut=formData;
    xhr.setRequestHeader('x-type','single');
  } else { var dataOut=JSON.stringify(vecIn); }
  
  xhr.onload=function () {
    var dataFetched=this.response;
    var data; try{ data=JSON.parse(this.response); }catch(e){ setMess(e);  return; }
    
    var dataArr=data.dataArr||[];  // Each argument of dataArr is an array, either [argument] or [altFuncArg,altFunc]
    delete data.dataArr;
    beRet(data);
    for(var i=0;i<dataArr.length;i++){
      var r=dataArr[i];
      if(r.length==1) {var f=arrRet[i]; if(f) f(r[0]);} else { window[r[1]].call(window,r[0]);   }
    }
  }
  xhr.onerror=function(e){ var tmp='statusText : '+xhr.statusText;  setMess(tmp); console.log(tmp);   throw 'bla';}
  
  xhr.send(dataOut); 
  busyLarge.show();
}


var beRet=function(data,textStatus,jqXHR){
  if(typeof jqXHR!='undefined') var tmp=jqXHR.responseText;
  for(var key in data){
    window[key].call(this,data[key]); 
  }
  busyLarge.hide();
}

app.GRet=function(data){
  var tmp;
  //tmp=data.strMessageText;   if(typeof tmp!="undefined") setMess(tmp);
  tmp=data.strMessageText;   if(typeof tmp!="undefined") {setMess(tmp); if(/error/i.test(tmp)) navigator.vibrate(100);}
  tmp=data.CSRFCode;   if(typeof tmp!="undefined") CSRFCode=tmp; 
  tmp=data.userInfoFrIP; if(typeof tmp!="undefined") {userInfoFrIP=tmp;}
  tmp=data.userInfoFrDBUpd; if(typeof tmp!="undefined") {  for(var key in tmp){ userInfoFrDB[key]=tmp[key]; }   }
  
  loginInfoToggleStuff(); 
  
  resetMess(10);
}




window.elHtml=document.documentElement;  window.elBody=document.body;
elBody.css({height:'100%'});
elHtml.css({height:'100%'});

window.boTouch = Boolean('ontouchstart' in document.documentElement);  //boTouch=1;

var ua=navigator.userAgent, uaLC = ua.toLowerCase(); //alert(ua);
window.boAndroid = uaLC.indexOf("android") > -1;
window.boFF = uaLC.indexOf("firefox") > -1; 


app.boChrome= /chrome/.test(uaLC);
app.boIOS= /iphone|ipad|ipod/.test(uaLC);
app.boEpiphany=/epiphany/.test(uaLC);    if(boEpiphany && !boAndroid) boTouch=false;  // Ugly workaround
app.boEdge= /\bedge?\b/.test(uaLC) ;

window.boOpera=RegExp('OPR\\/').test(ua); if(boOpera) boChrome=false; //alert(ua);

if(boTouch){
  if(boIOS) {
    var tmp={height:"100%", "overflow-y":"hidden", "-webkit-overflow-scrolling":"touch"};  //, overflow:'hidden'
    elBody.css(tmp);  elHtml.css(tmp);
  }  
} 

var h=window.innerHeight, w=window.innerWidth;
const boSmall=h*w<307200;  // As reference: 240*320=76800, 320*480=153600, 480*640=307200



var boHistPushOK='pushState' in history;
if(!boHistPushOK) { alert('This browser does not support history'); return;}
var boStateInHistory='state' in history;
if(!boStateInHistory) { alert('This browser does not support history.state'); return;}


assignSiteSpecific();

var oVersion=getItem('version'); app.boNewVersion=version!==oVersion;        setItem('version',version);

var userInfoFrDB=extend({}, specialistDefault);
//userInfoFrIP=extend({}, specialistDefault);
var userInfoFrIP=null;

var CSRFCode='';


var strScheme='http'+(boTLS?'s':''),    strSchemeLong=strScheme+'://',    uSite=strSchemeLong+site.wwwSite,     uCommon=strSchemeLong+wwwCommon,       uBE=uSite+"/"+leafBE;

var uBE=uSite+"/"+leafBE;
var uFE=uSite;
var wseImageFolder='/'+flImageFolder+'/';
var uImageFolder=uCommon+wseImageFolder;

var uImCloseW=uImageFolder+'triangleRightW.png';
var uImOpenW=uImageFolder+'triangleDownW.png';
var uImCloseB=uImageFolder+'triangleRight.png';
var uImOpenB=uImageFolder+'triangleDown.png';

var uHelpFile=uImageFolder+'help.png';
var uVipp0=uImageFolder+'vipp0.png';
var uVipp1=uImageFolder+'vipp1.png';
var uGoogle=uImageFolder+'google.jpg';
var uFB=uImageFolder+'fb68.png';
var uFBFacebook=uImageFolder+'fbFacebook.png';
//uIncreasing=uImageFolder+'increasing.png';
//uDecreasing=uImageFolder+'decreasing.png';
var uOpenId=uImageFolder+'openid-inputicon.gif';
var uOID22=uImageFolder+'oid22.png';
var uBusy=uImageFolder+'busy.gif';
var uBusyLarge=uImageFolder+'busyLarge.gif';
var uDelete=uImageFolder+'delete.png';
var uDelete1=uImageFolder+'delete1.png';


  //
  // History
  //
  
var strHistTitle='syncAMeeting';
//var uCanonical=uSite;
var uCanonical=document.location.href;

var histList=[];
var stateLoaded=history.state;
var tmpi=stateLoaded?stateLoaded.ind:0,    stateLoadedNew={hash:randomHash(), ind:tmpi};
history.replaceState(stateLoadedNew, '', uCanonical);
var stateTrans=stateLoadedNew;
history.StateMy=[];

window.on('popstate', function(event) {
  var dir=history.state.ind-stateTrans.ind;
  //if(Math.abs(dir)>1) {debugger; alert('dir=',dir); }
  var boSameHash=history.state.hash==stateTrans.hash;
  if(boSameHash){
    var tmpObj=history.state;
    if('boResetHashCurrent' in history && history.boResetHashCurrent) {
      tmpObj.hash=randomHash();
      history.replaceState(tmpObj, '', uCanonical);
      history.boResetHashCurrent=false;
    }

    var stateMy=history.StateMy[history.state.ind];
    if(typeof stateMy!='object' ) {
      var tmpStr=window.location.href +" Error: typeof stateMy: "+(typeof stateMy)+', history.state.ind:'+history.state.ind+', history.StateMy.length:'+history.StateMy.length+', Object.keys(history.StateMy):'+Object.keys(history.StateMy);
      if(!boEpiphany) alert(tmpStr); else  console.log(tmpStr);
      debugger;
      return;
    }
    var view=stateMy.view;
    view.setVis();
    if(typeof view.getScroll=='function') {
      var scrollT=view.getScroll();
      setTimeout(function(){window.scrollTop(scrollT);}, 1);
    } else {
      //var scrollT=stateMy.scroll;  setTimeout(function(){  window.scrollTop(scrollT);}, 1);
    }
    
    if('funOverRule' in history && history.funOverRule) {history.funOverRule(); history.funOverRule=null;}
    else{
      if('fun' in stateMy && stateMy.fun) {var fun=stateMy.fun(stateMy); }
    }

    stateTrans=extend({}, tmpObj);
  }else{
    stateTrans=history.state; extend(stateTrans, {hash:randomHash()}); history.replaceState(stateTrans, '', uCanonical);
    history.go(sign(dir));
  }
});
if(boFF){
  window.on('beforeunload', function(){   });
}





langClientFunc(); 

var tmp=createColJIndexNamesObj(listCol.KeyCol); extend(listCol,tmp); extend(window,tmp);
listCol.sel=createChildInd(listCol.backSel);   
listCol.vis=createChildInd(listCol.backVis);   

var maxWidth='800px';

var colButtAllOn='#9f9', colButtOn='#0f0', colButtOff='#ddd', colFiltOn='#bfb', colFiltOff='#ddd', colFontOn='#000', colFontOff='#777', colActive='#65c1ff', colStapleOn='#f70', colStapleOff='#bbb';
var colMenuBOn='#616161', colMenuBOff='#aaa';



var imgBusy=createElement('img').prop({src:uBusy, alt:"busy"});
//var spanMessageText=spanMessageTextCreate();  window.setMess=spanMessageText.setMess;  window.resetMess=spanMessageText.resetMess;  window.appendMess=spanMessageText.appendMess;  elBody.append(spanMessageText)
//spanMessageText.css({font:'courier'});

var divMessageText=divMessageTextCreate();  copySome(window, divMessageText, ['setMess', 'resetMess', 'appendMess']);
//divMessageText.css({font:'courier'});
var divMessageTextWInner=createElement('div').myAppend(divMessageText).css({margin:'0em auto', width:'100%', 'max-width':maxWidth, 'text-align':'center', position:'relative'});
var divMessageTextW=createElement('div').myAppend(divMessageTextWInner).css({width:'100%', position:'fixed', bottom:'0px', left:'0px', 'z-index':'10'});
elBody.append(divMessageTextW);

var busyLarge=createElement('img').prop({src:uBusyLarge, alt:"busy"}).css({position:'fixed',top:'50%',left:'50%','margin-top':'-42px','margin-left':'-42px','z-index':'1000',border:'black solid 1px'}).hide();
elBody.append(busyLarge);

//var imgHelp=createElement('img').prop({src:uHelpFile, alt:"help"}).css({'vertical-align':'-0.4em'});
var hovHelpMy=createElement('span').myText('❓').addClass('btn-round', 'helpButtonGradient').css({'margin-left':'0.6em', 'text-shadow':'0 0 0 black', 'font-size':'1rem'}).css({color:'transparent', 'text-shadow':'0 0 0 #5780a8'});
var imgHelp=hovHelpMy;

var arrDayName=['Su','M','Tu','W','Th','F','Sa'];
var arrMonthName=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];



elBody.css({padding:'0 0 0 0'});
elBody.css({margin:'0 0 0 0'});



var oAJAX={};




var cssDeleteButtonMouseOver={color:'white', 'text-shadow':'-2px 0 red, 2px 0 red, 0 -2px red, 0 2px red, -1px -1px red, 1px 1px red, -1px 1px red, 1px -1px red'};
var cssDeleteButtonMouseOut={color:'grey', 'text-shadow':''};



elBody.css({visibility:'visible',background:'#fff'});
elBody.css({display:'flex','flex-direction':'column'});



var divEntryBar=elBody.querySelector('#divEntryBar');
divEntryBarExtend(divEntryBar); divEntryBar.css({flex:'0 0 auto', padding:'0em', visibility:'hidden'}); //, 
//var divLoginInfo=divLoginInfoExtend(createElement('div')).css({padding:'0em 0em 0em 0em','font-size':'75%'});
var divLoginInfo=divLoginInfoExtend(createElement('div')).addClass('mainDivR').css({flex:'0 0 auto', 'min-height':'2rem'}).hide();  //, 'line-height':'1.6em'
divEntryBar.after(divLoginInfo);

var divH1=elBody.querySelector('#divH1');
var H1=divH1.querySelector('h1');
elBody.querySelector('noscript').detach();

const urlParams = new URLSearchParams(window.location.search), myParam = urlParams.get('uuid');
var strTitleHelp; if(myParam) strTitleHelp='Mark when you are busy and click save'; else strTitleHelp='Mark when you are busy, click save, and email the returned link to the other meeting participants.';

var imgH=imgHelp.cloneNode(1).css({margin:'0 0 0 0.5em'}),  bub=createElement('div').myHtml(strTitleHelp);     popupHover(imgH,bub);   //, 'vertical-align':'-0.3em'
divH1.myAppend(imgH);

divH1.css({flex:'0 0 auto'});


var inpTitle=createElement('input').prop({type:'text', placeholder:"Title"}).css({'font-weight':'bold','font-size':'130%', 'text-align':'center', 'max-width':'100%'});
var divTitle=createElement('div').css({'text-align':'center', margin:'0.3em'}).myAppend(inpTitle); //,'margin-bottom':'0.5em','border-bottom':'1px solid', ,'padding':'0.4em'



  // 
  // divFoot
  //
  
var butSetting=createElement('button').myText('⚙').prop({title:'Setup calender resolution etc.'}).css({'margin-right':'1em', flex:'0 0 auto'}).on('click',function(){
  doHistPush({view:settingPop});
  settingPop.setVis();
}); // ☰≡
var spanLinkList=createElement('span');
var butLinkList=createElement('button').myAppend('Links (', spanLinkList, ')').prop({title:'Previously stored meetings.'}).css({'margin-right':'1em'}).on('click',function(){
  linkListPop.setVis();
  doHistPush({view:linkListPop});
});
var butSave=createElement('button').myText('Save').on('click', function(){sch.save();}).css({'margin-right':'0.5em', flex:'0 0 auto'});
var spanRed=createElement('span').css({"background":"#f00",border:'black solid 1px', height:'1em', width:'1em', display:'inline-block', 'vertical-align':'bottom'});
var spanBusy=createElement('span').css({'float':"right"}).myAppend(spanRed,' = Busy'); 

var strTmp='https://emagnusandersson.com/syncAMeeting'; 
var aLink=createElement('a').attr({href:strTmp}).myText('More info');
var divLink=createElement('a').myAppend(aLink).css({'font-size':'100%','font-weight':'bold', flex:'1 1 auto'});
var divFoot=createElement('div').myAppend(butSetting, butSave, butLinkList, divLink, spanBusy);  
divFoot.css({bottom:'0px', display:'flex', 'flex-direction':'row', width:'100%', padding:'1em', 'text-align':'center', 'border-top':'1px solid', background:'white', flex:'0 0 auto'}); 



var divBlanket=createElement('div').css({position:'fixed', 'background-color':'white', width:'100%', 'z-index':1, opacity:'0.5', height:'100%', top:'0px', left:'0px'});


  // 
  // sch
  //
  
//var deleteRowConfirmPop=deleteRowConfirmPopExtend(createElement('div'));

var rewriteTabDiff=function(nStChange,nColsChange){
  var vTimeN=sch.calcVTime('','','',nStChange,nColsChange);  sch.convertMTab('',vTimeN);  sch.vTime=vTimeN;  sch.M2Table();
};
var tmpCss={position:'absolute', 'font-size':'120%'};
var butStEarlier=createElement('button').myText('⇦').css(tmpCss).css({right:'0.5em'}).prop({title:'Start schedule earlier.'}).on('click', function(e){
  rewriteTabDiff(-1,0);
});
var butStLater=createElement('button').myText('⇨').css(tmpCss).css({left:'0.5em'}).prop({title:'Start schedule later.'}).on('click', function(e){
  rewriteTabDiff(1,0);
});
var butDecCols=createElement('button').myText('-').css(tmpCss).css({right:'0.5em', width:'1.3em'}).prop({title:'Fewer columns.'}).on('click', function(e){
  rewriteTabDiff(0,-1);
});
var butIncCols=createElement('button').myText('+').css(tmpCss).css({left:'0.5em', width:'1.3em'}).prop({title:'Add columns.'}).on('click', function(e){
  rewriteTabDiff(0,1);
  this.scrollIntoViewIfNeeded();
});

var sch=scheduleExtend(createElement('table')).css({margin:'0 auto'});
var schW=createElement('div').myAppend(sch).css({flex:'1 1 auto', 'overflow-y':'scroll', height:'100%'}); //, scheduleList


  // 
  // ViewPop
  //
  
var linkCreatedPop=linkCreatedPopExtend(createElement('div'));
var loginPop=loginPopExtend(createElement('div'));   loginPop.setHead('Need an identity'); var loginReturn2=loginReturnList;


  // 
  // ViewSide
  //
  
var settingPop=settingPopExtend(createElement('div'));

var deleteScheduleConfirmPop=deleteScheduleConfirmPopExtend(createElement('div'));
var linkListPop=linkListPopExtend(createElement('div'));
var tmpCss={position:'fixed', 'background-color':'#ccc', border:'1px solid', width:'calc(100% - 1.5em)', 'box-sizing':'border-box', 'z-index':2, opacity:'0.92', 'max-height':'100%', top:'0px', 'max-width':'calc('+maxWidth+' - 1.5em)', height:'100%', 'font-size':'0.95em', transform:'translateX(-200%)', transition:'transform 0.5s, visibility 0.5s'};  // , 'overflow-y':'scroll' , 'overflow':'visible'
if(boIOS) extend(tmpCss, {'-webkit-transform':'translate3d(0,0,0)'}); 
[settingPop.divContW, linkListPop.divContW].forEach(ele=>ele.css(tmpCss)); 


//'width 0.5s, visibility 0.5s'
//transition: max-width 2s;
//width:'0px', visibility:'hidden'  , transition:'transform 0.5s, visibility 0.5s'


var MainDiv=[divEntryBar, divLoginInfo, divH1, divTitle, schW, divFoot]; //, saveDiv, scheduleList   , divRangeL, divRangeSt  , divRangeW



if(boSmall) { divH1.hide(); divTitle.css({'font-size':'80%'}); }
MainDiv.forEach(ele=>ele.css({'text-align':'left', background:'#fff','max-width':maxWidth,'margin-left':'auto','margin-right':'auto', 'box-sizing':'border-box', width:'100%'}));
[divH1, divTitle, divFoot].forEach(ele=>ele.css({'text-align':'center'}));
schW.css({'max-width':""})

var ViewPop=[loginPop, linkCreatedPop, deleteScheduleConfirmPop];
ViewPop.forEach(ele=>ele.hide());
var ViewSide=[settingPop, linkListPop];
ViewSide.forEach(ele=>{
  ele.css({'text-align':'left', background:'#fff','max-width':maxWidth,'margin-left':'auto','margin-right':'auto', 'box-sizing':'border-box', width:'100%'});
  ele.divBlanket.hide(); ele.divContW.css({transform:'translateX(-200%)', visibility:'hidden'})
});

elBody.append(...MainDiv, ...ViewPop, ...ViewSide);



history.StateMy[history.state.ind]={view:schW};

schW.setVis=function(){
  [...ViewPop].forEach(ele=>ele.hide());
  [settingPop, linkListPop].forEach(ele=>{ele.divBlanket.hide(); ele.divContW.css({transform:'translateX(-200%)', visibility:'hidden'})});
  //settingPop.css({'-webkit-overflow-scrolling':'auto'});
  //var tmp={height:"100%"}; elBody.css(tmp);  elHtml.css(tmp);
  return true;
}
settingPop.setVis=function(){
  this.show();
  //this.divContW.css({width:'calc(100% - 1.5em)', visibility:'visible'});
  this.divContW.css({transform:'translateX(0%)', visibility:'visible'});
  this.divBlanket.show();
  //settingPop.css({'-webkit-overflow-scrolling':'touch'});
  //var tmp={height:""}; elBody.css(tmp);  elHtml.css(tmp);
  //schW.css('position',''); setTimeout(function(){schW.css('position','fixed');},100);
  return true;
}
linkListPop.setVis=function(){
  this.show();  deleteScheduleConfirmPop.hide();
  //this.divContW.css({width:'calc(100% - 1.5em)'});
  this.divContW.css({transform:'translateX(0%)', visibility:'visible'});
  this.divBlanket.show();
  //settingPop.css({'-webkit-overflow-scrolling':'touch'});
  //var tmp={height:""}; elBody.css(tmp);  elHtml.css(tmp);
  //schW.css('position',''); setTimeout(function(){schW.css('position','fixed');},100);
  return true;
}
var lastActivity=0;
//firstAJAXCall();

var vec=[['specSetup'],['listSchedule',{},linkListPop.listScheduleRet]];
if(uuid!==null) vec.push(['getSchedule',{uuid:uuid}, sch.getScheduleRet]);
majax(oAJAX,vec);
setMess('Fetching data ',0,true);

//loginInfoToggleStuff();

}



