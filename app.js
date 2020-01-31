var http = require("http");
const UserController = require("./UserController.js");
//create a server object:
http
  .createServer(function(req, res) {
    if (req.url === "/") {
      UserController.getList(req, res);
    } else if (req.url === "/add") {
      UserController.getAddForm(req, res);
    } else if (req.url.match(/^\/edit\/([0-9])+/)) {
      UserController.getEditForm(req, res);
    } else if (req.url === "/post" && req.method === "POST") {
      UserController.post(req, res);
    } else if (req.url.match(/^\/update\/([0-9])+/) && req.method === "POST") {
      UserController.patch(req, res);
    } else {
      res.end("page not found");
    }
  })
  .listen(4001, function() {
    console.log("server start at port 4001"); //the server object listens on port 4001
  });
