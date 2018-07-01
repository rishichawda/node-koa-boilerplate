
###### Minimal Server boilerplate with Signup and Login using Passport, Bcrypt and JWT.
------------------------------------------------------------------------------------------------------------------

You'll need to create a folder named `config` ,containing _config.js file_, under the **root directory** which exports an object with,

  * your secret salt ( for bcrypt )  
  * your secret key for encoding using JWT  

_Example config.js :_
```javascript 
module.exports = {
  secret: // Your secret key for JWT encoding ,
  salt: // Your secret salt for bcrypt hash
}
```
