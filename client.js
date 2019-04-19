
(function(){


function createColJIndexNamesObj(arrName){
  var o={};
  for(var i=0;i<arrName.length;i++){ 
    var tmp="j"+arrName[i][0].toUpperCase()+arrName[i].substr(1);       o[tmp]=i;
  }
  return o;
}


function createChildInd(arrI){
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
// firstDayOfWeek can be from 0 to 6. If firstDayOfWeek (0 is Sunday, 1 is Monday ...).
// dateAlwaysInWOne is the date in January that is always in week 1 (For US: 1, for IS08601: 4)
// boRewriteWeekNames should be true if one would like to rewrite the year-shift-week to have a single name (belonging to what ever year it lies mostly in) (For US: 0, for IS08601: 1)
//
Date.prototype.getWeek = function (firstDayOfWeek,dateAlwaysInWOne,boRewriteWeekNames) {
        // tj="javascript time", dow="day of week"
	firstDayOfWeek = typeof firstDayOfWeek != 'undefined' ? firstDayOfWeek : 0; //default firstDayOfWeek to zero
	var tjJan1 = new Date(this.getFullYear(),0,1);
	var DOWJan1=(tjJan1.getDay()-firstDayOfWeek+7)%7; 
	var dayNow = Math.floor(    (   this.getTime()-tjJan1.getTime() - (this.getTimezoneOffset()-tjJan1.getTimezoneOffset())*60000   )/86400000    ) + 1;
	
  var DOWNow=DOWJan1+dayNow-1;
  var DOWDateAlwaysInW1=DOWJan1+dateAlwaysInWOne-1;
  var weekDateAlwaysInW1Floor=Math.floor(DOWDateAlwaysInW1/7); //if one just makes a floor one gets this value
  var weekErr=1-weekDateAlwaysInW1Floor;  //Error (difference between the real value and the (erratic) floored value)

  var weeknum = Math.floor((DOWJan1+dayNow-1)/7)+weekErr;

  if(boRewriteWeekNames){
    if(weeknum >= 52) { //This "if" is for crude selection only (saves a bit com computaion though)
		  var tjNextJan1 = new Date(this.getFullYear()+1,0,1);
		  var DOWNextJan1 = (tjNextJan1.getDay()-firstDayOfWeek+7)%7;
		  var dayNextNow = Math.floor(    (   this.getTime()-tjNextJan1.getTime() - (this.getTimezoneOffset()-tjNextJan1.getTimezoneOffset())*60000   )/86400000    ) + 1;  
      var dayDiff=1-dayNextNow;
      if(dayDiff<=DOWNextJan1 && DOWNextJan1<=3 ){weeknum=1; }  // If close to next year shift and (next years) Jan1 is early in the week
	  }
    else if(weeknum <= 1) { //This "if" is for crude selection only (saves a bit com computaion though)
		  var tjDec31 = new Date(this.getFullYear()-1,11,31);
      var weekDec31=tjDec31.getWeek(firstDayOfWeek,dateAlwaysInWOne,boRewriteWeekNames);
		  //var tjPrevJan1 = new Date(this.getFullYear()-1,0,1);
		  //var DOWPrevJan1 = (tjPrevJan1.getDay()-firstDayOfWeek+7)%7;
		  var dayDiff=dayNow-1;
      var daysOfWeekRemainingAtJan1=6-DOWJan1; // Week days remaining at Jan1  
		  if(dayDiff<=daysOfWeekRemainingAtJan1 && DOWJan1>=3 ){weeknum=weekDec31; }  // If close to prev year shift and Jan1 is late in the week
	  }
  }

	return weeknum;
};  

// Test code: t1=new Date('2008-12-27');$sch.start=t1.valueOf()/1000




/*******************************************************************************************************************
 * My popup
 *******************************************************************************************************************/



function popUpExtend($el){
  $el.openPop=function() {
    $messageText.detach(); $el.append($messageText);
    //siz=getViewPortSize();  winW=siz.w;winH=siz.h;
    //var siz=getViewPortSize(); var winW=siz.w;
    var winW=$(window).width(),winH=$(window).height();
    //var docH=getScrollHeight();
    var $doc=$(document), scrollX=$doc.scrollLeft(), scrollY=$doc.scrollTop(); 
    //var pageYOffset=window.pageYOffset;   if(typeof pageYOffset =='undefined') pageYOffset=document.body.scrollTop;
    $el.setBlanketSize();
  
    $el.addClass('popUpDiv');
    
    $('body').prepend($el.$blanket);  
    $('body').prepend($el);

    //$(window).scroll($el.setBlanketSize);
    $(window).on('scroll',$el.setBlanketSize);
    //$(window).scroll(function(){alert('tt');});
    
    var bubW=$el.width();    var x=scrollX+(winW-bubW)/2; if(x<0) x=0;
    var bubH=$el.height();    var y=scrollY+(winH-bubH)/2;  if(y<0) y=0;
    //$el.append("scrollY:"+scrollY+", winH:"+winH+", bubH:"+bubH);
    //if($.browser.msie)  $el.css({'left':x+'px'});   else $el.css({'top':y+'px','left':x+'px'});
    $el.css({'top':y+'px','left':x+'px'});
  }

  $el.closePop=function() { 
    $el.detach();    
    //$(window).unbind('scroll',$el.setBlanketSize);
    $(window).off('scroll',$el.setBlanketSize);
    $el.$blanket.detach(); 
    $body.append($messageText);
  }
  
  $el.setBlanketSize=function(){
    
    var docH = $(document).height(),winH = $(window).height(),blankH=docH>winH?docH:winH, blankHOld=$el.$blanket.css("height");
    if(blankH!=blankHOld)  $el.$blanket.css({"height": blankH  });
    var docW = $(document).width(),winW = $(window).width(),blankW=docW>winW?docW:winW, blankWOld=$el.$blanket.css("width");
    if(blankW!=blankWOld)  $el.$blanket.css({"width": blankW  });
    
  }
  
  $el.$blanket=$('<div>').addClass('blanketPop');
  $el.$blanket.css({'background':'#555'});
  //$el.$blanket.css({'background':'#fff'});
  return $el;
}


function toggleButtonExtend($el){
  $el.setStat=function(bo1){
    if(bo1==0) {$el.css(o0);} else {$el.css(o1);} 
    $el.attr({boOn:bo1});
  }
  var o0={background:'url('+uVipp0+') no-repeat'}, o1={background:'url('+uVipp1+') no-repeat'};
    
  $el.attr({boOn:0});
  $el.css({'background':'url('+uVipp0+') no-repeat',height:'33px',width:'90px',zoom:'60%','vertical-align':'-0.5em',cursor:'pointer',display:'inline-block'}).addClass('unselectable');
  $el.on('click',function(){var t=1-$el.attr('boOn');   $el.setStat(t);});
  return $el;
}


/*******************************************************************************************************************
 * Some loose functions
 *******************************************************************************************************************/
 
 
function messExtend($el){
  //$el.resetMess=function(){ $el.html(''); clearTimeout(messTimer); }
  $el.resetMess=function(time){ 
    if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    else {$el.html(''); clearTimeout(messTimer);} 
  }
  $el.setMess=function(str,time,boRot){  
    $el.html(str);  clearTimeout(messTimer); 
    if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    if(boRot) $el.append($imgBusy);
  };
  var messTimer;
  $el.addClass('message').css({'z-index':8100,position:'fixed'}); 
  return $el;
}





/*******************************************************************************************************************
 * Menu extenders
 *******************************************************************************************************************/


function menuRadioExtend($el,arrDivs){
  var clickFunc=function(e){
    var $el1=$(this), i=$el1.index();   //$div=$divs.eq(i);
    if(i in arrDivs)  $divs=arrDivs[i]; else $divs=[];
    if($divs.length==0) return;
    $spanActive.css({background:colMenuBOff});
    //$spansEmpty.hide();  $spansEmpty.html('&nbsp;');
    if($spansText.index($el1)!=-1){
      //$spansText.show();
      $el.show();
      $el1.css({background:colMenuBOn}); 
      //$el1.show();
      
    } else  {
      //$spans.hide();
      $el.hide();
    }
    $all.hide();    $divs.show();
  }
  $el.setHeight=function(){
    var $items=$el.children(':visible');
    if($items.length==0) return;
    var y0=$items.eq(0).position().top;
    var iRow=0,leftPrev=-20000;
    $items.each(function(i,el){
      $el1=$(el);
      var leftTmp=$el1.position().left;
      if(leftTmp<=leftPrev) { iRow++;}
      leftPrev=leftTmp;
      //var tmpDiff=-2.0*iRow;  $el1.css({top:tmpDiff+'em'});
    });
    //var tmpH=1.6+2.5*iRow;  $el.css({height:tmpH+'em'});
  }

  var $all=$([]), vBoActive=[];
  if(arguments.length>1){
    for(var i=0;i<arrDivs.length;i++){  if(arrDivs[i].length) { $all=$all.add(arrDivs[i]); vBoActive[i]=1;}}
  } else arrDivs=[];
  
  var $spans=$el.children("span");

  var $spanActive=$spans.filter(function(i){  return vBoActive[i]===1; });
  var $spanUnActive=$spans.filter(function(i){  return typeof vBoActive[i]=='undefined'; });

  //$el.css({'overflow-y':'hidden'});
  $spans.addClass('headingTopW unselectable');
  $spans.css({background:colMenuBOff,'margin':'0px 0.2em 0px 0.2em','border-top-left-radius':'0.4em','border-top-right-radius':'0.4em',padding:'0.1em 0.1em',border:'1px black solid','border-bottom':'0px',position:'relative',cursor:'pointer'});
  $spans.click(clickFunc);
  var $spansText=$spans.filter(function(i) { return $(this).html().length;});
  var $spansEmpty=$spans.filter(function(i) { return $(this).html().length===0;});
  $spansEmpty.hide();

  $spanUnActive.css({'background':'#fff'});
  
  $el.prepend($spans);
  return $el;
}
  
function menuCurtainExtend($el,arrDivs,boWhite,func){
  $el.scrollToMe=function(){    
    var tmp=$el.offset().top;
    $('body,html').animate({scrollTop:$el.offset().top},500);  }  
  var clickFunc=function(e){
    var $span=$(this), i=$span.index(), $div=$divsLoc.eq(i);
    var boShow=1-Number($span.attr('boShow'));
    $el.setStat(boShow,i);
  }
  $el.setStat=function(boShow,i){
    $spans.attr({boShow:0}); $spans.css(cssOff);     $divsLoc.hide();
    $all.hide();
    if(boShow) {
      var $span=$spans.eq(i), $div=$divsLoc.eq(i);
      $span.attr({boShow:1}); $span.css(cssOn);  $div.show();
      var $divs=$([]);  if(i in arrDivs)  $divs=arrDivs[i];
      $divs.show();
    }
    if(func) func(i); 
  }

  var $all=$([]);
  if(arguments.length>1){
    for(var i=0;i<arrDivs.length;i++){  $all=$all.add(arrDivs[i]);}
  } else arrDivs=[];

  var cssGen={margin:'0.3em 0.1em 0.3em 0.1em', padding:'0.2em 0.2em 0.2em 1em', cursor:'pointer', position:'relative', display:'inline-block',
          'margin-bottom':'0em','border-top-left-radius':'0.3em','border-top-right-radius':'0.3em'}; 

  var strImOpen, strImClose;
  if(boWhite) {strImOpen=uImOpenW; strImClose=uImCloseW; }  else {strImOpen=uImOpenB; strImClose=uImCloseB; }
  var cssWOff= {  color:'#fff', background: colMenuBOff+' url('+strImClose+') center left no-repeat' };
  var  cssWOn= { background: colMenuBOn+' url('+strImOpen+') center left no-repeat' };
  var cssBOff= {  color:'#336699', background: 'url('+strImClose+') center left no-repeat' };
  var  cssBOn= {  color:'#336699', background: 'url('+strImOpen+') center left no-repeat'};

  var cssOff,cssOn;  if(boWhite) {cssOff=cssWOff; cssOn=cssWOn;}  else {cssOff=cssBOff; cssOn=cssBOn;}
  var $divsLoc=$el.children("div");   $divsLoc.hide();
  var $spans=$el.children("span").addClass('unselectable').css(cssGen).css(cssOff);
  $spans.click(clickFunc).attr({boShow:0});
  $el.$spans=$spans;
  return $el;
}

loginReturnList=function(){  //   after 'loginbutt'->'loginScreen' or 'delete'->'loginScreen'
  if(isSetObject(userInfoFrIP)) {var vec=[['listSchedule',1]]; majax(oAJAX,vec); }
}

loginReturn=function(userInfoFrIPT,userInfoFrDBT,fun,strMess,CSRFCodeT){
  CSRFCode=CSRFCodeT;

  var tmp=['idIP','IP','nameIP','nickIP']; userInfoFrIP={};
  for(var i=0; i<tmp.length ;i++){ userInfoFrIP[tmp[i]]=userInfoFrIPT[tmp[i]];   }
  
  var tmp=['idUser','IP','idIP','nameIP','nickIP','created'];
  if(typeof userInfoFrDBT.customer == 'undefined' || typeof userInfoFrDBT.customer == 'unknown' || typeof userInfoFrDBT.customer == 'number') {}else{
    userInfoFrDB.customer={};
    for(var i=0; i<tmp.length ;i++){ userInfoFrDB.customer[tmp[i]]=userInfoFrDBT.customer[tmp[i]];   }   
  }
  
  resetMess();
  $loginInfo.setStat();
  toggleSpecialistButts(isSetObject(userInfoFrIP));
  $loginDiv.closeFunc();

  if(loginReturn2) loginReturn2();
}


/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * loginDivExtend
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

var loginDivExtend=function($el){ //popup for logging in as admin/sponsor...

  var popupWin=function(IP,openid) {
    //e.preventDefault();
    $pendingMess.show(); $cancelMess.hide();
    
    //var strFile='loginStart.php';
    var strFile=leafLogin;
    //var arrQ=['IP='+IP, 'fileReturn='+encodeURIComponent(leafLogin+'?fun='+strType+'Fun')];
    var strType='customer'
    var arrQ=['IP='+IP, 'fileReturn='+leafLogin,'fun='+strType+'Fun'];
    if(IP==='openid') arrQ.push('openid_identifier='+encodeURIComponent(openid));
    var uPop=strFile+'?'+arrQ.join('&');
    $el.win=window.open(uPop, 'popup', 'width=580,height=400');

    clearInterval(timerClosePoll);
    timerClosePoll = setInterval(function() { if($el.win.closed){ clearInterval(timerClosePoll); $pendingMess.hide(); $cancelMess.show(); }  }, 500);  
    return 0;
  }

  $el.openFunc=function(){
    $pendingMess.hide(); $cancelMess.hide(); 
    $el.openPop();  
  }
  $el.setLoggedIn=function(){  }
  $el.setLoggedOut=function(){   }
  $el.setLoggedStat=function(){ 
    clearInterval(timerClosePoll);  //$pendingMess.hide(); $cancelMess.hide(); 
  }
  $el.setHead=function(str){
    $head.html(str);
    return $el;
  }
  $el.closeFunc=function(){ clearInterval(timerClosePoll);   $el.closePop();    }
  var timerClosePoll;
  
  $el=popUpExtend($el); 
  $el.css({'max-width':'20em', padding: '1.2em 0.5em 1.2em 1.2em'});  
  //$el.css({ width:'25em', padding: '1.2em'});  
  
  var strType;
  
  var $headHelp=$imgHelp.clone().css({'margin-left':'1em'}),  $bub=$('<div>').html(langHtml.loginDiv.headHelp);     popupHoverJQ($headHelp,$bub);  
  var $head=$('<span>').append(langHtml.loginDiv.loginMethods);
  var $pHead=$('<p>').append($head,$headHelp);

  
  var strButtonSize='2em';
  var $fbIm=$('<img>').click(function(){popupWin('fb','');}).prop({src:uFB}).css({position:'relative',top:'0.4em',width:strButtonSize,heigth:strButtonSize});
  var $fbHelp=$imgHelp.clone().css({margin:'0 0 0 1em'}),  $bub=$('<div>').html(langHtml.loginDiv.fbComment);     popupHoverJQ($fbHelp,$bub);  

  var $googleIm=$('<img>').prop({src:uGoogle}).click(function(){popupWin('google','');}).css({position:'relative',top:'0.4em',width:strButtonSize,heigth:strButtonSize,'margin-left':'1em'}); 

  var $openIDIm=$('<img>').prop({src:uOID22}).css({position:'relative',top:'0.4em',width:strButtonSize,heigth:strButtonSize,'margin-left':'1em',background:'white'}); 
  $openIDIm.click(function(){$p2.toggle();});
  var $p1=$('<p>').append($fbIm); // ,$googleIm,$openIDIm


  var $field=$('<input>').prop({type:'text',size:19,width:'12em'});
    $field.css({background: 'url('+uOpenId+') no-repeat scroll 0 50% #fff', 'padding-left':'1.1em'});
    //$field.keypress( function(e){ if(e.which==13) popupWin('openid',$field.val()); } );
    $field=autocompleteFieldExtend($field,'openIDs',function(){popupWin('openid',$field.val());});
  var $openIdbutt=$('<button>').click(function(){$field.store(); popupWin('openid',$field.val());}).append('Go')
        .css({position:'relative',top:'0em','font-size':'0.8em'});
  //var $aListcreateAccount=$('<a>').prop({href:'http://openid.net/get-an-openid/',target:"_blank"}).html(langHtml.loginDiv.openIDProviders).css({'font-size':'75%'});
  var $aRecommend=$('<a>').prop({href:'https://emagnusandersson.com/Comparison_of_OpenID_providers',target:"_blank"}).html(langHtml.loginDiv.openIDProviders).css({'font-size':'75%'});
  var $p2=$('<p>').append('OpenID: ',$field,$openIdbutt,'<br>',$aRecommend); $p2.hide();

  var $cancel=$('<button>').click(function(){$el.closePop();}).html(langHtml.Cancel);//.css({'margin-top':'1.5em'});
  //if(boSharp) $p2='';
  $p1.add($p2).add($cancel).css({'margin-top':'1.5em', 'margin-right':'1.5em'});
  
  var $pendingMess=$('<span>').hide().append(langHtml.loginDiv.pendingMess,' ',$imgBusy.clone());
  var $cancelMess=$('<span>').hide().append(langHtml.loginDiv.cancelMess);
  
  $el.append($pHead,$p1,$p2,$cancel,$pendingMess,$cancelMess);  
  $el.css({'text-align':'left'});
  return $el;

}




/*******************************************************************************************************************
 * top-line-div
 *******************************************************************************************************************/
var loginInfoExtend=function($el){
  $el.setStat=function(){
    var boShow=0,arrKind=[];
    var boShow=isSetObject(userInfoFrIP);
    if(boShow){
      $spanName.html(userInfoFrIP.nameIP);
      //$spanKind.html('('+arrKind.join(', ')+')');
      //$el.css({visibility:''});
      $el.show();
    }else {
      //$el.css({visibility:'hidden'});
      $el.hide();  
    } 
  }
  var $spanName=$('<span>'), $spanKind=$('<span>'); 
  //var $logoutButt=$('<a>').attr({href:''}).text(langHtml.loginInfo.logoutButt).css({'float':'right'});
  var $logoutButt=$('<button>').text(langHtml.loginInfo.logoutButt).css({'float':'right','font-size':'90%'});
  $logoutButt.click(function(){ 
    userInfoFrIP={}; 
    var vec=[['logout',1]];   majax(oAJAX,vec); 
    //idSchedule=null; codeSchedule=''; lastActivity=0;
    return false;
  });
  
  $el.append($spanName,' ',$spanKind,' ',$logoutButt);
  $el.hide();
  return $el;
}





var toggleSpecialistButts=function(boIn){
  var boIn=Boolean(boIn);  
  $scheduleList.toggle(boIn); $loginButt.toggle(!boIn);
  //if(boIn) {$scheduleList.show(); $loginButt.hide();}  else {$scheduleList.hide(); $loginButt.show();}
}


function scheduleExtend($el){
  var dayStart=function(tu){
    var tj=new Date(tu*1000),st=Number(tj.setHours(0,0,0,0))/1000; return st; }
  var weekStart = function(tu) {
    var tj=new Date(tu*1000);
    var DOW=(tj.getDay()-$el.firstDayOfWeek+7)%7;
    var st=Number(tj.setHours(0,0,0,0))/1000 - DOW*24*60*60;     
    return st;
  }
  
  $el.calcStart=function(tApprox,unit){
    if(tApprox===0) {var tmp=new Date(); tApprox=tmp/1000;} 
    if(unit=='w') tmp=weekStart(tApprox); else tmp=dayStart(tApprox); return tmp;
  }

  $el.M2Table=function(){
    //$el.$thead.empty();  
    $el.$tbody.empty().detach();
    //var fragment = document.createDocumentFragment();
    
    if($el.vTime!=null) {
      var $rY=$('<tr>').append($('<th>').html('Year')), $rM=$('<tr>').append($('<th>').html('Month')), $rD=$('<tr>').append($('<th>').html('Date'));
      var $rW=$('<tr>').append($('<th>').html('Week')), $rN=$('<tr>').append($('<th>').html('Day')), $rH=$('<tr>').append($('<th>').html('Hour'));
      if($el.unit=='l') $rH.children('th').html('Lecture');
      var tHl='', tNl='', tWl='', tDl='', tMl='', tYl='';
      var cSpanH=1,cSpanN=1,cSpanW=1,cSpanD=1,cSpanM=1,cSpanY=1;
      for(var j=0;j<$el.vTime.length;j++) { 
        var tmp,t=new Date($el.vTime[j]*1000);
        var boRewriteWeekNames=0; if($el.dateAlwaysInWOne==4) {boRewriteWeekNames=1;}
        var tH=t.getHours(), tN=arrDayName[t.getDay()], tW=t.getWeek($el.firstDayOfWeek,$el.dateAlwaysInWOne,boRewriteWeekNames), tD=t.getDate(), 
            tM=arrMonthName[t.getMonth()], tY=t.getFullYear();
        if(tH!==tHl) {$hH=$('<th>').html(tH); $rH.append($hH);cSpanH=1;} else {cSpanH++;$hH.attr({colspan:cSpanH});}
        if(tN!==tNl) {$hN=$('<th>').html(tN); $rN.append($hN);cSpanN=1;} else {cSpanN++;$hN.attr({colspan:cSpanN});}
        if(tW!==tWl) {$hW=$('<th>').html(tW); $rW.append($hW);cSpanW=1;} else {cSpanW++;$hW.attr({colspan:cSpanW});}
        if(tD!==tDl) {$hD=$('<th>').html(tD); $rD.append($hD);cSpanD=1;} else {cSpanD++;$hD.attr({colspan:cSpanD});}
        if(tM!==tMl) {$hM=$('<th>').html(tM); $rM.append($hM);cSpanM=1;} else {cSpanM++;$hM.attr({colspan:cSpanM});}
        if(tY!==tYl) {$hY=$('<th>').html(tY); $rY.append($hY);cSpanY=1;} else {cSpanY++;$hY.attr({colspan:cSpanY});}
        tHl=tH;tNl=tN;tWl=tW;tDl=tD;tMl=tM;tYl=tY;
      }
      if($el.unit=='d') $rH='';
      if($el.unit=='w') {$rD=''; $rN=''; $rH='';}
      $el.$thead.empty().append($rY,$rM,$rD,$rW,$rN,$rH);
    }
    var makeKeyUpFunc=function(i){return function(){ $el.vNames[i]=this.value;}}
    if($el.MTab!=null && $el.vNames!=null) {
      for(var i=0;i<$el.MTab.length;i++) {
        var $img=$('<img>').attr({src:uDelete}).mouseover(function(){$(this).attr({src:uDelete1})}).mouseout(function(){$(this).attr({src:uDelete})})
              .click(makeRemovePersonFunc(i)).css({cursor:'pointer'});
        var $input=$('<input type=text placeholder=Name>').val($el.vNames[i]).keyup(makeKeyUpFunc(i));
        
        var $row=$('<tr>'),$td=$('<td>').append('&nbsp;',$img,' ',$input);
        $row.append($td); 
        for(var j=0;j<$el.MTab[i].length;j++) { 
          var tmp,eTmp=$el.MTab[i][j];
          if(eTmp==enumY) tmp='lightgreen'; else if(eTmp==enumN) tmp='red'; else tmp='';
          var $td=$('<td>').css({'background-color':tmp}).click(makeCellClickFunc(i,j));
          //$td.myState=eTmp;
          
          $row.append($td); 
        }
        $el.$tbody.append($row);
	    }
    }
    var $button=$('<button>').html('+').click(addPerson), $td=$('<td>').css({'text-align':'center'}).append($button), $row=$('<tr>').append($td);

    $el.$tbody.append($row);
    $el.append($el.$tbody);
    

    
  }
  
  var addPerson=function(){
    var nRows=$el.MTab.length,nCols=$el.vTime.length;
    var arrTmp=[]; for(var j=0;j<nCols;j++){arrTmp[j]=enumVoid;}
    $el.MTab.push(arrTmp); $el.vNames.push('');   $el.M2Table();
  }
  var makeRemovePersonFunc=function(iRemove){
    return function(){
      var nRows=$el.MTab.length,nCols=$el.vTime.length, nRowsN=nRows-1;
      var MTabN=[], vNamesN=[];
      for(var i=0;i<nRows;i++){ 
        if(i!=iRemove){
          MTabN.push($el.MTab[i]);
          vNamesN.push($el.vNames[i]);
        }
      }
      $el.MTab=MTabN;$el.vNames=vNamesN;   $el.M2Table();
    }
  }
  var makeCellClickFunc=function(i,j){ return function(){
    //var eTmp=(this.myState+1)%2, tmp;
    var eTmp=($el.MTab[i][j]+1)%2,tmp;
    $el.MTab[i][j]=eTmp;      
    //this.myState=eTmp;
    //if(eTmp==enumY) tmp='classYes'; else if(eTmp==enumN) tmp='classNo'; else tmp='';
    if(eTmp==enumY) tmp='lightgreen'; else if(eTmp==enumN) tmp='red'; else tmp='';
    $(this).css({'background-color':tmp});
  }}
   

  $el.calcVTime= function(startN,unitN,nCols,nStChange,nColsChange){ 
    var vTimeN=[], endN;
    if(startN==='') startN=$el.vTime[0];
    if(unitN==='') unitN=$el.unit;
    //var dirStChange=sign(nStChange), absStChange=Math.abs(nStChange);
    var dirStChange=nStChange>0?1:-1, absStChange=Math.abs(nStChange);
    var iChange=0;
    var startT=new Date(startN*1000);
    
    var iAvoidInfiniteLoop=0;
    while(1){ 
      var hour=startT.getHours(), day=startT.getDay();
      var boTmp1=$el.hFilter[hour] || (unitN=='d' || unitN=='w');
      var boTmp2=$el.dFilter[day] || unitN=='w';
      if(boTmp1 && boTmp2) { if(iChange==absStChange){ startN=startT/1000; break;} else iChange++;} 

      if(unitN=='h' || unitN=='l') { startT.setHours(startT.getHours()+dirStChange); }
      else if(unitN=='d') { startT.setDate(startT.getDate()+dirStChange); }
      else if(unitN=='w') { startT.setDate(startT.getDate()+dirStChange*7); }
      if(iAvoidInfiniteLoop>10000) debugger;
    }
    $el.start=startN;

    if(nCols==='') nCols=$el.MTab[0].length; nCols+=nColsChange; if(nCols<0) nCols=0;
    var startT=new Date(startN*1000);
    iAvoidInfiniteLoop=0;
    while(1){ 
      var hour=startT.getHours(), day=startT.getDay();
      var boTmp1=$el.hFilter[hour] || (unitN=='d' || unitN=='w');
      var boTmp2=$el.dFilter[day] || unitN=='w';
      if ( boTmp1 && boTmp2) { var tmp=startT/1000; vTimeN.push(tmp); if(vTimeN.length>=nCols){endN=tmp;break;}} 

      if(unitN=='h' || unitN=='l') { startT.setHours(startT.getHours()+1); }
      else if(unitN=='d') { startT.setDate(startT.getDate()+1); }
      else if(unitN=='w') { startT.setDate(startT.getDate()+7); };
       if(iAvoidInfiniteLoop>10000) debugger;
    }
    return vTimeN;
  }

  $el.convertMTab= function(unitN,vTimeN){  //$el.unit, $el.hFilter, $el.dFilter   => $el.start, vTime, $el.MTab, 
    var nRows=$el.MTab.length;
    var MTabN=[], nColsN=vTimeN.length;   
    if(unitN==='') unitN=$el.unitN;
    if(unitN==$el.unitN){      
      for(var i=0;i<nRows;i++){ 
        MTabN[i]=[];
        for(var j=0;j<nColsN;j++){
          var tmp=vTimeN[j];
          //confirm($el.vTime +' '+ tmp);  
          
          var jO=$el.vTime.indexOf(tmp); 
          if(jO!=-1) tmp=$el.MTab[i][jO]; else tmp=enumVoid;   MTabN[i][j]=tmp;    
        }
      }
    }else{
      for(var i=0;i<nRows;i++){  MTabN[i]=[];  for(var j=0;j<nColsN;j++){MTabN[i][j]=enumVoid;}  }
    }
    $el.MTab=MTabN;
  }
  $el.setDefaultHFilter=function(){for(var i=0;i<24;i++){$el.hFilter[i]=0;  if(i>=8 && i<=16) $el.hFilter[i]=1;}  }
  $el.setDefaultHFilterL=function(){for(var i=0;i<24;i++){$el.hFilter[i]=0;  if(i>=1 && i<=8) $el.hFilter[i]=1;}  }
  $el.setDefaultDFilter=function(){for(var i=0;i<7;i++){$el.dFilter[i]=0;  if(i>=1 && i<=5) $el.dFilter[i]=1;}  }
  $el.setDefaultFilters=function(){
    if($el.unit=='l') { $el.setDefaultHFilterL();}    else if($el.unit=='h') {$el.setDefaultHFilter(); } 
    if($el.unit=='l' || $el.unit=='h' || $el.unit=='d') {$el.setDefaultDFilter();} 
  }
  $el.setFilterUI=function(){
    $lectureFilter.hide(); $hourFilter.hide(); $dayFilter.hide();
    if($el.unit=='l') {  $lectureFilter.show();  $lectureFilter.setUpSel();  }  
    else if($el.unit=='h') {  $hourFilter.show();  $hourFilter.setUpButtStat();  } 

    if($el.unit=='l' || $el.unit=='h' || $el.unit=='d') {$dayFilter.show(); $dayFilter.setUpButtStat(); } 

    $firstDayOfWeek.setUp($el.firstDayOfWeek);
    $dateAlwaysInWOne.setUp($el.dateAlwaysInWOne);

    var tmp="input[value='"+$el.unit+"']";
    $unitSelector.children(tmp).attr({checked:1});
  }
  
  $el.save=function(e){
    //e.stopPropagation();
    if(isSetObject(userInfoFrIP) || idSchedule)     {
      var o={unit:$el.unit, firstDayOfWeek:$el.firstDayOfWeek, dateAlwaysInWOne:$el.dateAlwaysInWOne, start:$el.start, lastActivity:lastActivity};
      if(idSchedule!==null) o.idSchedule=idSchedule;
      if(codeSchedule!=='') o.codeSchedule=codeSchedule;
      o.title=$titleInp.$inp.val().trim();
      o.MTab=JSON.stringify($sch.MTab);
      o.vNames=JSON.stringify($sch.vNames);
      o.hFilter=JSON.stringify($sch.hFilter);
      o.dFilter=JSON.stringify($sch.dFilter);
      setMess('saving',10,1);
      var vec=[['saveSchedule',o],['listSchedule',1]]; 
      majax(oAJAX,vec);  
    }
    //else $messPop.setup("You have to login first").openFunc();
    else {
      loginReturn2=function(){
        $sch.save();
      }
      $loginDiv.openFunc();
    }
  }
  window.saveScheduleRet=function(data){
    idSchedule=data.idSchedule;
    codeSchedule=data.codeSchedule;
    lastActivity=data.lastActivity;
  }

  
  $el.getScheduleRet=function(data){
    var row=data.row;
    //confirm(print_r(row)); 
    for(var k in row){
      if(k!='idSchedule' && k!='codeSchedule' && k!='unit' && k!='title') row[k]=jQuery.parseJSON(row[k]);
      //confirm(print_r(row[k])); 
    }
    if(typeof row!=='undefined') {
       
      idSchedule=row.idSchedule;
      codeSchedule=row.codeSchedule;
      //IP=row.IP;   idIP=row.idIP;
      lastActivity=row.lastActivity;

      $title.html(row.title);   $titleInp.$inp.val(row.title);
      $el.MTab=row.MTab;
      $el.unit=row.unit;
      $el.firstDayOfWeek=row.firstDayOfWeek;
      $el.dateAlwaysInWOne=row.dateAlwaysInWOne;
      $el.start=row.start;
      $el.vNames=row.vNames;
      $el.hFilter=row.hFilter;
      $el.dFilter=row.dFilter;
    } else row=[]; 

    $el.start=$el.calcStart($el.start,$el.unit);
    $el.vTime=$el.calcVTime($el.start,'','',0,0);
    $el.setFilterUI();
    $el.M2Table();

  }
  $el.revert=function(){
    if(idSchedule) vec[2]=['getSchedule',{idSchedule:idSchedule},$el.getScheduleRet];   majax(oAJAX,vec); 
  }

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  $el.$tbody=$('<tbody>'); $el.$thead=$('<thead>');
  $el.append($el.$thead,$el.$tbody);
  
  $el.hFilter=[],$el.dFilter=[],$el.MTab=[],$el.vNames=[],$el.firstDayOfWeek=1,$el.dateAlwaysInWOne=4,$el.unit='d';
  
  for(var i=0;i<24;i++){$el.hFilter[i]=0;  if(i<16 && i>=8) $el.hFilter[i]=1;}
  for(var i=0;i<7;i++){$el.dFilter[i]=0;  if(i>=1 && i<=5) $el.dFilter[i]=1;}

  $el.MTab=[];$el.vNames=[];
  for(i=0;i<5;i++){
    $el.vNames[i]=""; $el.MTab[i]=[];
    for(j=0;j<14;j++){ $el.MTab[i][j]=enumVoid; }
  }
  var tmp=new Date();
  $el.start=$el.calcStart(tmp/1000,$el.unit);
  $el.vTime=$el.calcVTime($el.start,'','',0,0);
  $el.M2Table();

  return $el;
}
///////////////////////////////////////////////////////////////////////////////
// End of scheduleExtend
///////////////////////////////////////////////////////////////////////////////

loginButtExtend=function($el){
  $el.append('Login').click(function(){loginReturn2=loginReturnList; $loginDiv.openFunc();});
  return $el;
}

function unitSelectorExtend($el){
  $el.setUpButtStat=function(){
    //var $b=$el.children("input[value='"+$sch.unit+"']"); $b.attr({checked:1});
    //$sch.setUnit($sch.unit);
    $sch.setFilterUI();
    //for(var i=0;i<4;i++){  var $b=$el.children('input:eq('+i+')');  if($sch.hFilter[i]==1) $b.css($el.colOn); else $b.css($el.colOff);  }
  }
  var makeFunc=function(u){return function(){ 
    //$sch.setUnit(u);
    $sch.unit=u; $sch.setDefaultFilters(); $sch.setFilterUI();
    var startN=$sch.calcStart(0,u), vTimeN=$sch.calcVTime(startN,'',20,0,0);
    $sch.convertMTab(u,vTimeN);  $sch.unit=u; $sch.vTime=vTimeN;
    $sch.M2Table(); return 0;}}
  $el.empty();
  var $buttL=$('<input>').attr({type:'radio',name:'unit'}).val('l').change(makeFunc('l'));
  var $buttH=$('<input>').attr({type:'radio',name:'unit'}).val('h').change(makeFunc('h'));
  var $buttD=$('<input>').attr({type:'radio',name:'unit'}).val('d').change(makeFunc('d'));
  var $buttW=$('<input>').attr({type:'radio',name:'unit'}).val('w').change(makeFunc('w'));
  $el.append('Calender resolution: ',$buttL,'lectures, ',$buttH,'hours, ',$buttD,'days, ',$buttW,'weeks');
  return $el;
}

function lectureFilterExtend($el){
  $el.setUpSel=function(){
    var iSel=0;
    for(var i=0;i<nLec;i++){
      if($sch.hFilter[i]) iSel=i;
    }
    var $o=$el.find('option:eq('+(iSel-1)+')'); 
    $o.attr('selected', 1);
  }
  var nLec=10;
  $sel=$('<select>');
  for(var i=0;i<nLec;i++){  
    var $opt=$("<option>").val(i+1).html(i+1);
    $sel.append($opt);
  }
  $sel.change(function(){
    var arrtmp=[],tmp=$sel.val();
    //for(var i=0;i<tmp;i++) arrtmp.push(i+1); 
    for(var i=0;i<24;i++) {if(i>=1 && i<=tmp) arrtmp[i]=1; else arrtmp[i]=0;}; 
    $sch.hFilter=arrtmp;
    var vTimeN=$sch.calcVTime($sch.start,'','',0,0);
    $sch.convertMTab('',vTimeN);   $sch.vTime=vTimeN;   $sch.M2Table();
    $el.setUpSel();
  });
  $el.append("Number of lectures per day: ",$sel);
  
  return $el;
}

function hourFilterExtend($el){
  $el.setUpButtStat=function(){
    for(var i=0;i<24;i++){  var $b=$el.children('button:eq('+i+')');  if($sch.hFilter[i]==1) $b.css($el.colOn); else $b.css($el.colOff);  }
  }
  $el.colOn={background:'#4f4'};$el.colOff={background:'#eee'};
  var makeFunc=function(i){ return function(){ 
    $sch.hFilter[i]=1-$sch.hFilter[i]; 
    var anyOn=0; for(var j=0;j<$sch.hFilter.length;j++){if($sch.hFilter[j]==1) anyOn=1;} 
    if(anyOn==0) {$sch.hFilter[i]=1-$sch.hFilter[i]; } // At least one has to be 'on'

    //if($sch.hFilter[i]) $(this).css($el.colOn); else $(this).css($el.colOff); 
    var vTimeN=$sch.calcVTime($sch.start,'','',0,0);
    $sch.convertMTab('',vTimeN);   $sch.vTime=vTimeN;   $sch.M2Table();
    $el.setUpButtStat();
    
  };  } 
  $el.append('Only include certain hours:<br>');
  for(var i=0;i<24;i++){ var $but=$('<button>').html(i).click(makeFunc(i));  $el.append($but);}
  
  return $el;
}

function dayFilterExtend($el){
  $el.setUpButtStat=function(){
    for(var i=0;i<7;i++){  var $b=$el.children('button:eq('+i+')');  if($sch.dFilter[i]==1) $b.css($el.colOn); else $b.css($el.colOff);  }
  }
  var makeFunc=function(i){ return function(){
    $sch.dFilter[i]=1-$sch.dFilter[i]; 
    var anyOn=0; for(var j=0;j<7;j++){if($sch.dFilter[j]==1) anyOn=1;} 
    if(anyOn==0) {$sch.dFilter[i]=1-$sch.dFilter[i]; } // At least one has to be 'on'
    if($sch.dFilter[i]) $(this).css($el.colOn); else $(this).css($el.colOff);
    var vTimeN=$sch.calcVTime($sch.start,'','',0,0);
    $sch.convertMTab('',vTimeN);   $sch.vTime=vTimeN;   $sch.M2Table();
  };  } 
  $el.colOn={background:'#4f4'};$el.colOff={background:'#eee'};
  $el.append('Only include certain days: ');
  for(var i=0;i<7;i++){ var $but=$('<button>').html(arrDayName[i]).click(makeFunc(i));  $el.append($but,'&nbsp;&nbsp;');}
  return $el;
}



function firstDayOfWeekExtend($el){
  $el.setUp=function(i){
    var $o=$el.find('option:eq('+i+')'); 
    $o.attr('selected', 1);
  }
  var $sel=$('<select>').change(function(){
    $sch.firstDayOfWeek=Number($sel.val()); 
    $sch.M2Table();});
  var arrWeekDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  for(var i=0;i<arrWeekDays.length;i++) {
    var $opt=$('<option>').val(i).html(arrWeekDays[i]); $sel.append($opt);
  }
  $sel.children('option:eq(1)').attr('selected', 1);
  $el.append("First day of the week: ",$sel);
  return $el;
}

function dateAlwaysInWOneExtend($el){
  $el.setUp=function(i){
    var $o=$el.find(":radio[value='"+i+"']"); 
    $o.attr('checked', true);
  }
  var makeFunc=function(d){return function(){ 
    $sch.dateAlwaysInWOne=Number(d);    $sch.M2Table(); return 0;
  }}
  var $r0=$('<input>').attr({type:'radio',name:'dateAlwaysInWOne'}).val(1).change(makeFunc(1));
  var $r1=$('<input>').attr({type:'radio',name:'dateAlwaysInWOne'}).val(4).change(makeFunc(4));
  
  var $d0=$('<div>').append($r0,"Week #1 is the week that contains Jan 1 (used in America, Asia ...)");
  var $d1=$('<div>').append($r1,"Week #1 is the first week that mainly lies in the new year (the week that contains Jan 4) (ISO8601, used in some EU countries)");
  var $tmp=$d0.push($d1).css({margin:'1em 0'});
  $el.append($tmp);
  $r1.attr('checked',1);
  return $el;
}

function titleInpExtend($el){
  $el.$inp=$('<input type=text placeholder=Title>').keyup( function(e){ $title.text($el.$inp.val().trim()); } );
  $el.append($el.$inp);
  return $el;
}

var settingsDivExtend=function($el){
  var $peroidDiv=$('<div>').append('Change start of period: ',$buttStEarlier,'&nbsp;&nbsp;',$buttStLater,' Change length of period: ',$buttDecCols,'&nbsp;&nbsp;',$buttIncCols);

  var $tmp=$([]).add($titleInp).add($unitSelector).add($dayFilter).add($firstDayOfWeek).add($dateAlwaysInWOne).add($lectureFilter).add($hourFilter).add($peroidDiv);
  $tmp.css({'margin-left':'1em','margin-right':'1em','margin-top':'1em','margin-bottom':'1em'});
  $el.append($tmp);
  return $el;
}






var messPopExtend=function($el){
  var $el=popUpExtend($el);
  $el.openFunc=$el.openPop;
  $el.setup=function(strMess){$el.$mess.html(strMess); return $el;}
  $el.$mess=$('<div>');
  var $ok=$('<button>').html("OK").click($el.closePop);
  $el.append($el.$mess,$ok);
  $el.css({padding:'1.1em'});
  return $el;
}

var deleteConfirmPopExtend=function($el){
  var $el=popUpExtend($el);
  $el.setup=function(idScheduleRowT){idScheduleRow=idScheduleRowT;}
  $el.$yes=$('<button>').html('Yes').click(function(){
    var vec=[['deleteSchedule',{idSchedule:idScheduleRow}],['listSchedule',1]];   majax(oAJAX,vec);
    if(idScheduleRow===idSchedule) { idSchedule=''; codeSchedule='';}
    $el.closePop();
  });
  var idScheduleRow;
  var $cancel=$('<button>').html("Cancel").click($el.closePop);
  $el.append("Do you really want to delete this schedule?",'<br>',$el.$yes,$cancel);
  $el.css({padding:'1.1em'});
  return $el;
}

scheduleListExtend=function($el){
  var makeDeleteFunc=function(i){return function(){ 
    if(isSetObject(userInfoFrIP)){
      $deleteConfirmPop.setup(i); $deleteConfirmPop.openPop(); $deleteConfirmPop.$yes.focus();
    }
    else {
      loginReturn2=loginReturnList;
      $loginDiv.openFunc();
    }
  };}
  window.listScheduleRet=function(data){
    //return;
    tmp=data.tab;   if(typeof tmp==="undefined") tmp=[]; tab=tmp; $el.tab=tab;
    $tbody.empty();
    
    for(var i=0;i<tab.length;i++){   
      var idSchedule=tab[i][jIdSchedule], tmp2=tab[i][jCodeSchedule];
      var tmp=uFE+'?idSchedule='+idSchedule+'&codeSchedule='+tmp2;
      var $alink=$('<a>').attr({href:tmp}).append(tmp);
      var $del=$('<img>').attr({src:uDelete}).click(makeDeleteFunc(idSchedule))
                .mouseover(function(){$(this).attr({src:uDelete1})}).mouseout(function(){$(this).attr({src:uDelete})});
      var $tr=$('<tr>').append($('<td>').append($del), $('<td>').append($alink), $('<td>').append(tab[i][jTitle]), $('<td>').append(swedDate(tab[i][jCreated])),
        $('<td>').append(swedDate(tab[i][jLastActivity]))   ); 
      $tbody.append($tr);
    }
    $table.toggle(Boolean(tab.length));
    toggleSpecialistButts(isSetObject(userInfoFrIP));
    $tbody.find('td:nth-child(1)').css({'padding-left':'0.5em'});
  }
  var tab=[]; $el.tab=tab;
  //idSchedule,codeSchedule,unit,UNIX_TIMESTAMP(start) AS start,UNIX_TIMESTAMP(lastActivity) AS lastActivity,UNIX_TIMESTAMP(created) AS created 
  var $thead=$('<thead>').append($('<tr>').append($('<th>').html(''), $('<th>').html('Link to send to the meeting participants.'), $('<th>').html('Title'), $('<th>').html('Created'), $('<th>').html('Last activity')));
  var $tbody=$('<tbody>');
  var $table=$('<table>').append($thead,$tbody).css({'font-size':'100%'});
  $el.append($table);
  return $el;
}







/*******************************************************************************************************************
 * LoadTab-callbacks
 *******************************************************************************************************************/


var majax=function(oAJAX,vec){  // Each argument of vec is an array: [serverSideFunc, serverSideFuncArg, returnFunc]
"use strict"
  var makeRetF=function(vecT){ return function(data,textStatus,jqXHR){ 
      var dataArr=data.dataArr;  // Each argument of dataArr is an array, either [argument] or [argument,altFunc]
      delete data.dataArr;
      beRet(data,textStatus,jqXHR);
      for(var i=0;i<dataArr.length;i++){ 
        var r=dataArr[i];
        if(r.length==1) {var f=vecT[i][2]; if(f) f(r[0]);} 
        else { window[r[1]].call(window,r[0]);   } 
      }   
    }; 
  }
  $.ajaxSetup(oAJAX);
  var vecN=$.extend(true, [], vec);
  for(var i=0; i<vecN.length; i++){delete vecN[i][2];}
  vecN.push(['CSRFCode',CSRFCode]);
  var tmp=JSON.stringify(vecN);
  
  if(oAJAX.crossDomain) tmp=o;
  var func=makeRetF(vec),   ajaxHnd=$.ajax({success:func,data:tmp});
  return ajaxHnd;
}


beRet=function(data,textStatus,jqXHR){
  if(typeof jqXHR!='undefined') var tmp=jqXHR.responseText;
  for(var key in data){
    window[key].call(this,data[key]); 
  }
}

GRet=function(data){
  var tmp;
  tmp=data.strMessageText;   if(typeof tmp!="undefined") setMess(tmp);
  tmp=data.CSRFCode;   if(typeof tmp!="undefined") CSRFCode=tmp; 
  tmp=data.userInfoFrIP; if(typeof tmp!="undefined") {userInfoFrIP=tmp;}
  tmp=data.userInfoFrDBUpd; if(typeof tmp!="undefined") {  for(var key in tmp){ userInfoFrDB[key]=tmp[key]; }   }
  
  $loginInfo.setStat(); 
  toggleSpecialistButts(isSetObject(userInfoFrIP)); 
  
  resetMess(10);
}






var setup1=function(){

  elHtml=document.documentElement;  elBody=document.body
  $body=$('body');
  browser={brand:'bla'};

  boTouch = Boolean('ontouchstart' in document.documentElement);  //boTouch=1;
  
  var ua=navigator.userAgent, uaLC = ua.toLowerCase(); //alert(ua);
  boAndroid = uaLC.indexOf("android") > -1;
  boFF = uaLC.indexOf("firefox") > -1; 
  //boIE = uaLC.indexOf("msie") > -1; 
  versionIE=detectIE();
  boIE=versionIE>0; if(boIE) browser.brand='msie';

  boChrome= /chrome/i.test(uaLC);
  boIOS= /iPhone|iPad|iPod/i.test(uaLC);
  boEpiphany=/epiphany/.test(uaLC);    if(boEpiphany && !boAndroid) boTouch=false;  // Ugly workaround

  boOpera=RegExp('OPR\\/').test(ua); if(boOpera) boChrome=false; //alert(ua);

  dr=window.devicePixelRatio; 
  if(boIOS) {       
    sc=1/dr; 
    //if(dr>=2) sc=0.8;
    sc=0.5;
  } else {  sc=1; }
  //if(boIOS) {  dr=window.devicePixelRatio;  sc=1/dr;} else {  sc=1; }

 
  var w=screen.width, h=screen.height;
  var w=screen.availWidth, h=screen.availHeight;
  var w=$(window).width(), h=$(window).height();
  var w=window.innerWidth, h=window.innerHeight;
  
  if(boAndroid) $('#viewportMy').attr('content','width=device-width,initial-scale='+sc);
  else $('#viewportMy').attr('content','initial-scale='+sc);

  //$('#viewportMy').attr('content','width=device-width,initial-scale='+sc+',minimum-scale='+sc+',maximum-scale='+sc);
  //$('#viewportMy').attr('content','width=device-width,initial-scale='+sc+', user-scalable=no');
  //alert($('#viewportMy').attr('content'));
  //$('#viewportMy').attr('content','width=device-width');


  
 
  assignSiteSpecific();

  var oVersion=getItem('version');
  if(version!==oVersion) boNewVersion=1; else boNewVersion=0; 
  setItem('version',version);

  userInfoFrDB=jQuery.extend({}, specialistDefault);
  //userInfoFrIP=jQuery.extend({}, specialistDefault);
  userInfoFrIP=null;

  CSRFCode='';
 

  strScheme='http'+(boTLS?'s':'');    strSchemeLong=strScheme+'://';    uSite=strSchemeLong+wwwSite;     uCommon=strSchemeLong+wwwCommon;       uBE=uSite+"/"+leafBE;

  uBE=uSite+"/"+leafBE;
  uFE=uSite;
  wseImageFolder='/'+flImageFolder+'/';
  uImageFolder=uCommon+wseImageFolder;

  uImCloseW=uImageFolder+'triangleRightW.png';
  uImOpenW=uImageFolder+'triangleDownW.png';
  uImCloseB=uImageFolder+'triangleRight.png';
  uImOpenB=uImageFolder+'triangleDown.png';

  uHelpFile=uImageFolder+'help.png';
  uVipp0=uImageFolder+'vipp0.png';
  uVipp1=uImageFolder+'vipp1.png';
  uGoogle=uImageFolder+'google.jpg';
  uFB=uImageFolder+'fb.png';
  uFBFacebook=uImageFolder+'fbFacebook.png';
  //uIncreasing=uImageFolder+'increasing.png';
  //uDecreasing=uImageFolder+'decreasing.png';
  uOpenId=uImageFolder+'openid-inputicon.gif';
  uOID22=uImageFolder+'oid22.png';
  uBusy=uImageFolder+'busy.gif';
  uDelete=uImageFolder+'delete.png';
  uDelete1=uImageFolder+'delete1.png';
   

  langClientFunc(); 

  var tmp=createColJIndexNamesObj(listCol.KeyCol); $.extend(listCol,tmp); $.extend(window,tmp);
  listCol.sel=createChildInd(listCol.backSel);   
  listCol.vis=createChildInd(listCol.backVis);   

  colMenuBOn='#616161'; colMenuBOff='#aaa';

  


  $imgBusy=$('<img>').attr({src:uBusy});
  $messageText=messExtend($("<span>"));  window.setMess=$messageText.setMess;  window.resetMess=$messageText.resetMess;   $body.append($messageText);
  $messageText.css({font:'courier'});

  $imgHelp=$('<img>').attr({src:uHelpFile}).css({'vertical-align':'-0.4em'});
  
  
  arrDayName=['Su','M','Tu','W','Th','F','Sa'];
  arrMonthName=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

   

  

  
  $body.css({padding:'0 0 0 0'});
  $body.css({margin:'0 0 0 0'});
  
  

  $.ajaxSetup({
    url: uBE,
    global: false,
    type: "POST",
    //dataType:'json',
    contentType:'application/json',
    processData:false,
    success: beRet,
    //success: function(data){alert('ss');},
    error: function(jqXHR, textStatus, errorThrown){
      setMess('responseText: '+jqXHR.responseText+', textStatus: '+' '+textStatus+', errorThrown: '+errorThrown);     throw 'bla';
    }
  });


  //oAJAXSponList={url:uSponListBE,crossDomain:true,type: "GET",dataType:'jsonp', processData:true, success: beReth, jsonpCallback: 'beRet'};
  oAJAX={url:uBE,type: "POST",dataType:'json', processData:false,success: beRet};
 

  setTimeout(setup2,1);
}
function beReth(tmp){ }



var setup2=function(){

  colButtAllOn='#9f9', colButtOn='#0f0', colButtOff='#ddd', colFiltOn='#bfb', colFiltOff='#ddd', colFontOn='#000', colFontOff='#777', colActive='#65c1ff', colStapleOn='#f70', colStapleOff='#bbb';

  $body.css({visibility:'visible',background:'#fff'});
  //$loginInfo=loginInfoExtend($('<div>'));  $loginInfo.css({padding:'0px 0px 0px 0px',height:'0.9em'});
  $loginInfo=loginInfoExtend($('<div>'));  $loginInfo.css({padding:'0em 0em 0em 0em','font-size':'75%'});
    
  $H1=$('h1:eq(0)');

  var strTmp='https://emagnusandersson.com/syncAMeeting'; 
  var $aLink=$('<a>').attr({href:strTmp}).append('More info').css({'font-size':'100%','font-weight':'bold'}); 
  $iframe=$('<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fsyncameeting.eu01.aws.af.cm&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;font&amp;colorscheme=light&amp;action=like&amp;height=21&amp;appId=511686352189575" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:21px;" allowTransparency="true"></iframe>');
  $iframe.css({'vertical-align':'middle','margin-left':'1em'});
  $aDiv=$('<div>').append($aLink).css({'margin-bottom': '1em'});   

  $titleInp=titleInpExtend($('<div>'));

  $unitSelector=unitSelectorExtend($('<div>'));   
  $dayFilter=dayFilterExtend($('<div>'));  
  $lectureFilter=lectureFilterExtend($('<div>'));  
  $hourFilter=hourFilterExtend($('<div>')); 
  //$boxWeek=boxWeekExtend($('<div>'));  
  $firstDayOfWeek=firstDayOfWeekExtend($('<div>'));  
  $dateAlwaysInWOne=dateAlwaysInWOneExtend($('<div>'));  
  

  var makeFunc=function(nStChange,nColsChange){return function(){
    var vTimeN=$sch.calcVTime('','','',nStChange,nColsChange);  $sch.convertMTab('',vTimeN);  $sch.vTime=vTimeN;  $sch.M2Table();
  };};
  $buttStEarlier=$('<button>').html('&lt;').click(makeFunc(-1,0));
  $buttStLater=$('<button>').html('&gt;').click(makeFunc(1,0));
  $buttDecCols=$('<button>').html('-').click(makeFunc(0,-1));
  $buttIncCols=$('<button>').html('+').click(makeFunc(0,1));

  $settingsHead=$('<span>').html('Settings:');
  $settingsDiv=settingsDivExtend($('<div>'));  $settingsDiv.addClass('content');//.css({'line-height':'2em'});

  $settingsDivOuter=menuCurtainExtend($('<div>').append($settingsHead,$settingsDiv),[],0);

  $sch=scheduleExtend($('<table>'));
  $unitSelector.setUpButtStat();  $hourFilter.setUpButtStat();  $dayFilter.setUpButtStat();


  $title=$('<div>').css({'font-weight':'bold','font-size':'150%','margin-top':'0.6em','margin-bottom':'0.5em'});

  $deleteConfirmPop=deleteConfirmPopExtend($('<div>'));
  $loginDiv=loginDivExtend($('<div>'));   $loginDiv.setHead('Need an identity'); loginReturn2=loginReturnList;
  $scheduleList=scheduleListExtend($('<div>')).hide().css({margin:'0.2em auto 0.6em'});

  $messPop=messPopExtend($('<div>'));

  var $saveButton=$('<button>').html('Save').click($sch.save);
  var $spanRed=$('<span>').css({"background":"#f00",border:'black solid 1px'}).html('&nbsp;&nbsp;&nbsp;');
  var $spanBusy=$('<span>').css({'float':"right"}).append($spanRed,' = Busy'); 
  $loginButt=loginButtExtend($('<button>'));
  
  var $saveDiv=$('<div>').append('<br>',$saveButton, ' ',$loginButt,$spanBusy).css({margin:'0.2em auto 0.6em'});

 
 
  $mainDivs=$([]).push($loginInfo).push($H1).push($aDiv).push($settingsDivOuter).push($title).push($sch).push($saveDiv).push($scheduleList);
  $body.append($mainDivs);
  
  
  
  var w=window.innerWidth, h=window.innerHeight;
  var w=screen.availWidth, h=screen.availHeight;
  
  var tmpArr=[];
  var w=screen.width, h=screen.height;    tmpArr.push('screen.width='+w+', '+h);
  var w=screen.availWidth, h=screen.availHeight;    tmpArr.push('screen.availWidth='+w+', '+h);
  var w=$(window).width(), h=$(window).height();    tmpArr.push('$(window).width='+w+', '+h);
  var w=window.innerWidth, h=window.innerHeight;    tmpArr.push('window.innerWidth='+w+', '+h);
  //alert(tmpArr.join('\n'));
  
  if(boIOS){w=dr*w;h=dr*h;}

  $mainDivs.css({'text-align':'left',background:'#fff','max-width':'800px','margin-left':'auto','margin-right':'auto'});
  //$mainDivs.css({'text-align':'left',background:'#fff','max-width':w+'px','margin-left':'auto','margin-right':'auto'});
  
  $H1.css({'text-align':'center',background:'#ff0',border:'solid 1px',color:'black','font-size':'2em','font-weight':'bold',
      padding:'0.6em 0.2em 0.6em 0.2em',margin:'0.2em auto 0.2em auto'}); 
  $title.css({'text-align':'center'});

  $sch.css({'width':'auto','text-align':''});

  lastActivity=0;
  //firstAJAXCall();

  var vec=[['specSetup',1],['listSchedule',1]];
  if(idSchedule!==null) vec.push(['getSchedule',{idSchedule:idSchedule,codeSchedule:codeSchedule}, $sch.getScheduleRet]);
  majax(oAJAX,vec);
  setMess('Fetching data ',0,true);

  toggleSpecialistButts(0);


  //if(boIOS) $(window).bind('orientationchange', orientationChangeMy);
  //else $(window).bind('resize', orientationChangeMy);
  //orientationChangeMy();

  
}
//
//debugger

function setWidth(w){
  var maxWidth=800;  if(w>maxWidth) w=maxWidth;
  var textPadding=5;
  $mainDivs.css({'width':(w-10)+'px'});
  //var tmpMarg=10; if(boAndroid) tmpMarg=20;
  //$menuTop.css({'width':(w-tmpMarg)+'px'});
  
  //var tmp=textPadding+'px';  $divsText.css({width:(w-2*textPadding)+'px','padding-left':tmp,'padding-right':tmp});
}
function orientationChangeMy(event){  
  //window.scrollTo(0, 1);
  var tmpArr=[];
  var w=$(window).width(), h=$(window).height();    tmpArr.push('$(window).width='+w+', '+h);
  var w=window.innerWidth, h=window.innerHeight;    tmpArr.push('window.innerWidth='+w+', '+h);
  var w=screen.width, h=screen.height;    tmpArr.push('screen.width='+w+', '+h);
  var w=screen.availWidth, h=screen.availHeight;    tmpArr.push('screen.availWidth='+w+', '+h);
  
  //alert(tmpArr.join('\n'));
  
  var boPortrait=0;  if(typeof window.orientation!=='undefined' && Math.abs(window.orientation)!=90 ) boPortrait=1; 
  
  if(boIOS){w=dr*w;h=dr*h; if(boPortrait==0) w=h;}

  
  //alert('p'+window.orientation+' '+w+'x'+h);
  
  if(boIOS) {   $('#viewportMy').attr('content','width='+w+'px, initial-scale='+sc); }
  //else {   $('#viewportMy').attr('content','width='+w+'px, initial-scale='+sc); }
  

  //alert($('#viewportMy').attr('content'));
  
  //else  if(boPortrait) {  if(w>h) {tmp=w; w=h;h=tmp;}  }else {  if(w<h) {tmp=w; w=h;h=tmp;}  }
  
  setWidth(w);
}


/*******************************************************************************************************************
 * Document ready function
 *******************************************************************************************************************/

window.onload=function(){
   setup1();
};

})();



