

//
// For variable naming convention see https://emagnusandersson.com/prefixes_to_variables
//



googleSiteVerification='googleXXXXXXXXXXXXXXXX.html'; // If you use google.com/webmasters
intDDOSMax=100; // intDDOSMax: How many request before DDOSBlocking occurs. 
tDDOSBan=5; // tDDOSBan: How long in seconds til the blocking is lifted



//
// Endpoint urls for the IdP.
//
strFBVersion="v9.0"
UrlOAuth={fb:"https://www.facebook.com/"+strFBVersion+"/dialog/oauth", google:"https://accounts.google.com/o/oauth2/v2/auth"}
UrlToken={fb:"https://graph.facebook.com/"+strFBVersion+"/oauth/access_token", google:"https://accounts.google.com/o/oauth2/token"}
UrlGraph={fb:"https://graph.facebook.com/"+strFBVersion+"/me", google:"https://www.googleapis.com/plus/v1/people/me"};
strIPPrim='fb';


strBTC='1abcdefghijklmnopqrstuvwxyzABCDEFG'; // Bitcoin address
ppStoredButt="ABCDEFGHIJKLM"; 




  //
  //  Since one might want use the software on several different infrastrucures (heroku.com, appfog.com, digitalocean.com, localhost ...),
  //  then I personally use an environment variable "strInfrastructure" on respective site, set to either to 'heroku', 'af', 'do' or nothing assigned (localhost)
  //  This way one can use the same config file for all the infrastructures.
  //

if(process.env.strInfrastructure=='heroku'){
    // UriDB: An assoc-array of databases (incase you have more than one of them) (written in JSON syntax)
    // Each "key" (like "myDB" in this example) is the name of the database (which will for example be used
    // to reference it (like in the "Site"-variable below.))
  UriDB={ }
  //UriDB.myDB='mysql://user:password@localhost/database';

    // If you added the ClearDB-database on the heroku.com-interface then that one is added as "default".
  if('CLEARDB_DATABASE_URL' in process.env) UriDB.default=process.env.CLEARDB_DATABASE_URL; 


    // Heroku uses the environment variable "PORT" to store the port used:
  port = parseInt(process.env.PORT, 10);

    // RootDomain: An assoc-array of root domains (written in JSON syntax)
    // Each "key" is the name of the root domain (which will for example be used to reference
    // it (like in the "Site"-variable below.))
    // fb: Facebook variables (See more on developer.facebook.com)
    // google: Google variables (See more on googles pages)
  RootDomain={
    exampleDomain:{fb:{id:"XXXXXXXXXXXXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}},
    gavottCom:{fb:{id:"XXXXXXXXXXXXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}},
    herokuappCom:{fb:{id:"XXXXXXXXXXXXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}}
  }

    // Site: An assoc-array of "site" (instances) (each representing a voting (a referendum)) 
    // vPassword: view password
    // aPassword: administrator password
    // strRootDomain: key in RootDomain (above)
    // wwwSite: A string to determine which site each incomming request belongs to.
    //   (Note: if the request-url matches multiple entries then the first one is used
    //   Ex: if you have one site at "example.com" and an other at "example.com/abc" then "example.com/abc" 
    //   should come first.)
    // googleAnalyticsTrackingID: Needed if you use Google Analytics  
    // boTLS: whether to use TLS or not 

  Site={
    syncameetingHeroku:{wwwSite:"syncameeting.herokuapp.com", strRootDomain:"herokuappCom", googleAnalyticsTrackingID:"", boTLS:1},
    syncameeting:{wwwSite:"YOURWWW", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"", boTLS:0}
  }

    // If levelMaintenance=1 then visitors gets a "Down for maintenance"-message
  //levelMaintenance=1;


}else if(process.env.strInfrastructure=='af'){  // (is yet to be written)
}else if(process.env.strInfrastructure=='do'){
  UriDB={default:'mysql://user:password@localhost/database'};
  port = 8082;  

  RootDomain={
    exampleDomain:   {
      fb:{id:"XXXXXXXXXXXXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},
      google:{id: "", secret:"",redir:'c'}
    }
  }

  Site={
    sync:{wwwSite:"sync.example.com", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"", boTLS:0}
  }

  //levelMaintenance=1;
}
else{
  UriDB={myDB:'mysql://user:password@localhost/database'};

 
  RootDomain={
    "192Loc":{
      fb:{id:"000000000000000", secret:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
      google:{id:"a",secret:"b",redir:'c'} 
    },
    localhost:{
      fb:{id:"000000000000000", secret:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
      google:{id:"X",secret:"X",redir:'http://localhost:5000/loginReturn'}
    }
  }

  var wwwLocalhost="localhost:"+port, www192="192.168.0.5:"+port;  // just some temprary variables
  Site={
    "192loc":{wwwSite:www192, strRootDomain:"192Loc", googleAnalyticsTrackingID:"", boTLS:0},
    localhost:{wwwSite:wwwLocalhost, strRootDomain:"localhost", googleAnalyticsTrackingID:"", boTLS:0}
  }



  //levelMaintenance=1;

  boDbg=1; // debug mode

}

  // If wwwCommon is not set then set it to the first "wwwSite" in "Site"
if(!wwwCommon) {var keys=Object.keys(Site); wwwCommon=Site[keys[0]].wwwSite; }  



