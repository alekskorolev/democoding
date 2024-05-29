var ActiveDirectory = require('activedirectory');
        
var username = 'uid=aleksandr.korolev,cn=users,dc=corp,dc=gpbmobile,dc=ru';
var password = 'eve9TnjH!sH4RRf';
    
var ad = new ActiveDirectory({
  "url": "ldap://corp.gpbmobile.ru",
  "baseDN": "dc=corp,dc=gpbmobile,dc=ru"
});
    
ad.authenticate(username, password, function (err, auth) {
  if (err) {
    console.log({ 
        err,
      status:404,
      'msg':'Wrong Credential!!',
      'data':false
    })
  }
  if (auth) {
    console.log('Authenticated from Active directory!');
    console.log({ 
      status:200,
      'msg':'Success',
      'data':true
    })
  }
});