//create schema and model for mongoose database
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var urlSchema = new schema({
  url_id : String, 
  original_url : String}, 
  { collection: 'tinyUrl'},
  {timestamps: true});

/********
* module is a variable that represents current module and exports is an object 
* that will be exposed as a module. So, whatever you assign to module.exports or exports, 
* will be exposed as a module.
**************/
var littleUrl = mongoose.model('littleUrl', urlSchema);
module.exports = littleUrl;

