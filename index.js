const http = require("http");
const Promise = require("promise");
const axios = require("axios");

module.exports = class login{
  constructor(cookie) {
    this.cookie = cookie;
    validate(cookie);
    this.csrf = "";
    let holder;
    getCSRF(cookie)
    .catch(function (error) {
      holder = error.response.headers["x-csrf-token"];
    })
    .then(() => {
      this.csrf = holder;
    });
  }
}

function getCSRF(cookie){
  return axios({
    method: 'post',
    url: "https://auth.roblox.com/v2/logout",
    headers: {
      "Content-Type": "application/json",
      "Cookie": ".ROBLOSECURITY="+cookie
    }
  });
}

function validate(cookie) {
  axios({
    method: 'get',
    url: "https://auth.roblox.com/v2/auth/metadata",
  })
  .catch(error => {
    console.log("Invalid Cookie!");
  });
}

module.exports.promote = async function(groupid, userid, loginClass){
  return new Promise(function(resolve, reject) {
    axios({
      method: 'get',
      url: "https://api.roblox.com/users/"+userid+"/groups",
    })
    .then(response => {
      var getPlayerRank = 0;
      for(var i=0; i<response.data.length; i++){
        if(response.data[i].Id == groupid){
          getPlayerRank = response.data[i].Rank;
        }
      }
      axios({
        method: 'get',
        url: "https://groups.roblox.com/v1/groups/"+groupid+"/roles",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        var idInJson = 0;
        for(var i=0; i<response.data.roles.length; i++){
          if(response.data.roles[i].rank == getPlayerRank+1){
            idInJson = i;
          }
        }
        axios({
          method: 'patch',
          url: "https://groups.roblox.com/v1/groups/"+groupid+"/users/"+userid,
          headers: {
            "Content-Type": "application/json",
            "Cookie": ".ROBLOSECURITY="+loginClass.cookie,
            "x-csrf-token": loginClass.csrf
          },
          data: {
            "roleId":response.data.roles[idInJson].id
          }
        })
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          reject('' + error);
        });
      });
    });
  });
}

module.exports.demote = async function(groupid, userid, loginClass){
  return new Promise(function(resolve, reject) {
    axios({
      method: 'get',
      url: "https://api.roblox.com/users/"+userid+"/groups",
    })
    .then(response => {
      var getPlayerRank = 0;
      for(var i=0; i<response.data.length; i++){
        if(response.data[i].Id == groupid){
          getPlayerRank = response.data[i].Rank;
        }
      }
      axios({
        method: 'get',
        url: "https://groups.roblox.com/v1/groups/"+groupid+"/roles",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        var idInJson = 0;
        for(var i=0; i<response.data.roles.length; i++){
          if(response.data.roles[i].rank == getPlayerRank-1){
            idInJson = i;
          }
        }
        axios({
          method: 'patch',
          url: "https://groups.roblox.com/v1/groups/"+groupid+"/users/"+userid,
          headers: {
            "Content-Type": "application/json",
            "Cookie": ".ROBLOSECURITY="+loginClass.cookie,
            "x-csrf-token": loginClass.csrf
          },
          data: {
            "roleId":response.data.roles[idInJson].id
          }
        })
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          reject('' + error);
        });
      });
    });
  });
}

module.exports.exile = async function(groupid, userid, loginClass){
  return new Promise(function(resolve, reject) {
    axios({
      method: 'delete',
      url: "https://groups.roblox.com/v1/groups/"+groupid+"/users/"+userid,
      headers: {
        "Content-Type": "application/json",
        "Cookie": ".ROBLOSECURITY="+loginClass.cookie,
        "x-csrf-token": loginClass.csrf
      }
    })
    .then(response => {
      resolve(true);
    })
    .catch(error => {
      reject(''+error);
    });
  });
}

module.exports.acceptReq = async function(groupid, userid, loginClass){
  return new Promise(function(resolve, reject) {
    axios({
      method: 'post',
      url: "https://groups.roblox.com/v1/groups/"+groupid+"/join-requests/users/"+userid,
      headers: {
        "Content-Type": "application/json",
        "Cookie": ".ROBLOSECURITY="+loginClass.cookie,
        "x-csrf-token":loginClass.csrf
      }
    })
    .then(response => {
      resolve(true);
    })
    .catch(error => {
      reject(''+error);
    });
  });
}

module.exports.denyReq = async function(groupid, userid, loginClass){
  return new Promise(function(resolve, reject) {
    axios({
      method: 'delete',
      url: "https://groups.roblox.com/v1/groups/"+groupid+"/join-requests/users/"+userid,
      headers: {
        "Content-Type": "application/json",
        "Cookie": ".ROBLOSECURITY="+loginClass.cookie,
        "x-csrf-token":loginClass.csrf
      }
    })
    .then(response => {
      resolve(true);
    })
    .catch(error => {
      reject(''+error);
    });
  });
}

module.exports.fire = async function(groupid, userid, loginClass){
  return new Promise(function(resolve, reject) {
    axios({
      method: 'get',
      url: "https://groups.roblox.com/v1/groups/"+groupid+"/roles",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      var idInJson = 0;
      for(var i=0; i<response.data.roles.length; i++){
        if(response.data.roles[i].rank == 1){
          idInJson = i;
        }
      }
      axios({
        method: 'patch',
        url: "https://groups.roblox.com/v1/groups/"+groupid+"/users/"+userid,
        headers: {
          "Content-Type": "application/json",
          "Cookie": ".ROBLOSECURITY="+loginClass.cookie,
          "x-csrf-token": loginClass.csrf
        },
        data: {
          "roleId": response.data.roles[idInJson].id
        }
      })
      .then(response => {
        resolve(true);
      })
      .catch(error => {
        reject('' + error);
      });
    });
  });
}


module.exports.setRank = async function(groupid, userid, rankid, loginClass){
  return new Promise(function(resolve, reject) {
    axios({
      method: 'get',
      url: "https://groups.roblox.com/v1/groups/"+groupid+"/roles",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      var idInJson = 0;
      for(var i=0; i<response.data.roles.length; i++){
        if(response.data.roles[i].rank == rankid){
          idInJson = i;
        }
      }
      axios({
        method: 'patch',
        url: "https://groups.roblox.com/v1/groups/"+groupid+"/users/"+userid,
        headers: {
          "Content-Type": "application/json",
          "Cookie": ".ROBLOSECURITY="+loginClass.cookie,
          "x-csrf-token": loginClass.csrf
        },
        data: {
          "roleId": response.data.roles[idInJson].id
        }
      })
      .then(response => {
        resolve(true);
      })
      .catch(error => {
        reject('' + error);
      });
    });
  });
}

module.exports.setGroupStatus = async function(groupid, message, loginClass){
  return new Promise(function(resolve, reject) {
    axios({
      method: 'patch',
      url: "https://groups.roblox.com/v1/groups/"+groupid+"/status",
      headers: {
        "Content-Type": "application/json",
        "Cookie": ".ROBLOSECURITY="+loginClass.cookie,
        "x-csrf-token": loginClass.csrf
      },
      data: {"message": message}
    })
    .then(response => {
      resolve(true);
    })
    .catch(error => {
      reject('' + error);
    });
  });
}

module.exports.getAudit = async function(groupid, loginClass) {
  return new Promise(function(resolve, reject) {
    axios({
      method: 'get',
      url: "https://groups.roblox.com/v1/groups/"+groupid+"/audit-log",
      responseType: 'json/application',
      headers: {
        "Content-Type": "application/json",
        "Cookie": ".ROBLOSECURITY="+loginClass.cookie
      }
    })
    .then(function (response) {
      var parsedRes = JSON.parse(response);
      resolve(parsedRes);
    });
  });
}

module.exports.getGroupInfo = async function(groupid) {
  return new Promise(function(resolve, reject){
    axios({
      method: 'get',
      url: "http://api.roblox.com/groups/"+groupid+"/",
      responseType: 'json/application'
    })
    .then(function (response) {
      var parsedRes = JSON.parse(response);
      resolve(parsedRes);
    })
    .catch(function (error) {
      reject(error);
    });
  });
}
