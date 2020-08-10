const http = require("http");

module.exports.getGroupInfo = function(groupid) {
  console.log("Getting group info ran");
  http.get("http://api.roblox.com/groups/"+groupid+"/")
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
}
