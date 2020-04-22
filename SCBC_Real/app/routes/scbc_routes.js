const fs = require("fs")
const path = require("path")
module.exports = function(app, db) {
    app.post("/createitem", (req,res) => {
      console.log(req.body);
      //data = JSON.parse(req.body);
      console.log(req.body.id);
      let id = req.body.id.toString();
      let data = JSON.stringify(req.body);
      fs.writeFile(path.join(__dirname, "../../token_metadata/token" + id +".json"), data, (err) => {
        if (err) throw err;
      });
      res.send("hello");
    })
}
