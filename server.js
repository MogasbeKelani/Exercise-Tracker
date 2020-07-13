const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')

mongoose.connect(
  "mongodb+srv://Mohammed:gGQqhJPldYPjR4uA@cluster0.adzvc.mongodb.net/Cluster0?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    description: String,
    duration: Number,
    date: { type: Date, default: Date.now }

})
var userDb = mongoose.model('userDb',userSchema);

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'));

var port = 3000;

app.listen(port);
console.log('server on '+port);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.post('/api/exercise/new-user', function(req, res) {
  var username = req.body.username;
 userDb.findOne({'username':username},function(err,obj){
   if(err)
   {
     console.log(err);
   }
   if (obj == null){
       var userIn = new userDb({
           username: username
         });
       userIn.save(function(err,data){
         if(err)
         {
           console.log(err);
         }
           else{
             console.log(data);
             res.json({"username":username,'_id':data._id});
           }
       });
   }
   else{
     res.json({"Error":"Username Already Exists!"});
   }
 });
});

app.post('/api/exercise/add', function(req, res) {
  var userId = req.body.userId;
  var description = req.body.description;
  var duration = req.body.duration;
  var dateString=req.body.date;
  var dateValue;
  if (dateString === undefined){
    dateValue = new Date();
  }
  else if (!(dateString.includes("-")))
  {
    dateString = Number(req.params.date_string);
    dateValue = new Date(dateString);
  }
  else{
    dateValue = new Date(dateString);
  }
  if (!userId.match(/^[0-9a-fA-F]{24}$/))
  {
    res.json({'Error': 'UserId Invalid'});
  }
  if ((!userId) || (!description) || (!duration))
  {
    res.json({'Error': 'UserId, Description & Duration are all mandatory sections'});
  }
  else{
    userDb.findById(userId,function(err,data)
    {
      if(err)
      {
        console.log(err);
      }
    else{
     if (data == null){
       res.json({"Error":"UserId Not Found!"});
     }
    else{
        var userIn = new userDb({
          username: data.username,
          description:description,
          duration: duration,
          date: dateValue
        });

        userIn.save(function(err,data){
          if(err)
          {
            console.log(err);
          }
            else{
              res.json(data);
            }
        });
         res.send(data);
    }
    }
    });
  }
});
