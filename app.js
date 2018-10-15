var bodyParser = require('body-parser'),
    express = require('express'),
    expressSanitizer = require('express-sanitizer'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    app = express();
    
//app config
mongoose.connect('mongodb://yubin:yubin0819@ds133113.mlab.com:33113/blogapp', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

//mongoose/ model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema)

//RESTful routes
app.get('/', function(req, res) {
    res.redirect('/blogs');    
});

app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
       if(err) {
           console.log('error');
       } else {
           res.render('index', {blogs: blogs}); 
       }
    });
});


//new route
app.get('/blogs/new', function(req, res) {
   res.render('new'); 
});

//create route
app.post('/blogs', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
       if(err) {
           res.render('new');
       } else {
           res.redirect('/blogs');
       }
   }); 
});

//show route
app.get('/blogs/:id', function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog) {
      if(err) {
          res.redirect('/blogs');
      } else {
          res.render('show', {blog: foundBlog});
      }
   });
});


//edit route
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    });
});

//update route
app.put('/blogs/:id', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect('/blogs');
      }  else {
          res.redirect('/blogs/' + req.params.id);
      }
   });
});

//destroy route
app.delete('/blogs/:id', function(req, res) {
    Blog.findOneAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect('/blogs');
       } else {
           res.redirect('/blogs');
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log('Server Running'); 
});