var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// required: true,
var Task = new Schema({
  task : String,
  created_at: { type: Date, default: Date.now },
  updated_at : Date
});

var Task = mongoose.model('Task', Task);

app.get('/api/tasks', function(req, res, next){
  Task.find({}, function (err, docs) {
    res.json(docs);
  }); 
});

app.post('/api/tasks', function(req, res){
  var doc = new Task(req.body.task);
  doc.save(function (err) {
    if (!err) {
      res.json(doc);
    } else {
      res.send(err, 422);
    }   
  }); 
});

app.get('/api/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    if (doc) {
      res.json(doc);
    } else {
      res.json(404);
    }   
  }); 
});

app.put('/api/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    if (!doc) {
      res.json(404)
    } else {
      doc.updated_at = new Date();
      doc.task = req.body.task.task;
      doc.save(function (err) {
        if (!err) {
          res.json(doc);
        } else {
          res.send(err, 422);
        }   
      }); 
    }   
  }); 
});

app.del('/api/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    if (doc) {
      doc.remove(function() {
        res.json(200)
      });
    } else {
      res.json(404)
    }
  });
});