const fs = require("fs"),
  path = require("path");
const { parse } = require("querystring");
exports.getList = getList = async (req, res) => {
  filePath = path.join(__dirname, "db.json");
  fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
    if (!err) {
      res.setHeader("Content-Type", "text/html");
      res.end(generateHtml(JSON.parse(data).users));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "something went wrong." }, null, 3));
      console.log(err);
    }
  });
};

exports.post = post = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let body = "";
  let user = "";
  req.on("data", chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on("end", () => {
    user = parse(body);
    user.id = new Date().getTime();
    filePath = path.join(__dirname, "db.json");
    fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
      if (!err) {
        const users = JSON.parse(data);
        users.users.push(user);
        writeFile(filePath, users, response => {
          res.end(response);
        });
      } else {
        res.end(JSON.stringify({ error: "something went wrong." }, null, 3));
        console.log(err);
      }
    });
  });
};

exports.patch = patch = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let body = "";
  let user = "";
  req.on("data", chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on("end", () => {
    user = parse(body);
    filePath = path.join(__dirname, "db.json");
    fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
      if (!err) {
        const users = JSON.parse(data);
        var index = users.users.findIndex(item => item.id == user.id);
        // Replace the item by index.
        users.users.splice(index, 1, {
          email: user.email,
          id: user.id,
          name: user.name
        });
        writeFile(filePath, users, response => {
          res.end(response);
        });
      } else {
        res.end(JSON.stringify({ error: "something went wrong." }, null, 3));
        console.log(err);
      }
    });
  });
};
function writeFile(filePath, users, cb) {
  fs.writeFile(filePath, JSON.stringify(users, null, 3), function(err) {
    if (err) {
      cb(JSON.stringify({ error: "something went wrong." }, null, 3));
    }
    cb(
      JSON.stringify(
        { message: "User saved successfully", users: users },
        null,
        3
      )
    );
  });
}

module.exports.getAddForm = (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end(generateUserFormHtml(null));
};
module.exports.getEditForm = (req, res) => {
  res.setHeader("Content-Type", "text/html");
  let id = req.url.substr(req.url.lastIndexOf("/") + 1);

  filePath = path.join(__dirname, "db.json");
  fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
    if (!err) {
      res.end(
        generateUserFormHtml(JSON.parse(data).users.find(item => item.id == id))
      );
    } else {
      res.end(JSON.stringify({ error: "something went wrong." }, null, 3));
      console.log(err);
    }
  });
};

// Dyamic Html Generate Here for add and edit form
function generateUserFormHtml(data) {
  let html = `<!doctype html>
  <html>
  <body>
      <form action="${
        data && data.id ? "/update/" + data.id : "/post"
      }" method="post">`;
  if (data && data.id) {
    html += `<input type="hidden" value="${data.id}" name="id" />`;
    html += `<input type="hidden" name="method" value="patch" />`;
  }
  html += `<input type="name" name="name" value="${
    data && data.name ? data.name : ""
  }" /><br />
          <input type="email" name="email" value="${
            data && data.email ? data.email : ""
          }"/><br />
          <button>Save</button>
      </form>
  </body>
  </html>`;
  return html;
}

// Dyamic Html Generate Here for listing
function generateHtml(data) {
  let html = `<!doctype html>
  <html>
  <body>
      <a href="/add"> Add New User </a>
      <table>
        <tr>
          <td>Name</td>
          <td>Email</td>
          <td>Action</td>
        <tr>`;

  data.forEach(element => {
    html += `<tr>
          <td>${element.name}</td>
          <td>${element.email}</td>
          <td>
            <a href="/delete/${element.id}"> Delete </a> 
            <a href="/edit/${element.id}"> edit </a> 
          </td>
        <tr>`;
  });

  html += `</table>
  </body>
  </html>`;
  return html;
}
