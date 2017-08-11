//import dependencies
var express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  db = require('./models');
Post = require('./models/post');

const cities = [
  {
    _id: 1,
    title: 'San Francisco',
    imgPath: ''
  }
];

//create instances
var app = express(),
  router = express.Router();

// set port to env or 3000
var port = process.env.API_PORT || 3001;

//config API to use bodyParser and look for JSON in req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Prevent CORS errors
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );

  //Remove caching
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//set route path and init API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!' });
});

/////////////
/// CITY ////
////////////

//get all city
router.get('/cities', function(req, res) {
  db.City.find({}, function(err, cities) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(cities);
  });
});

//get one cities
router.get('/cities/:id', function(req, res) {
  db.City.findById(req.params.id, function(err, city) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(city);
  });
});

//create city
router.post('/cities', function(req, res) {
  console.log('city create', req.body);

  var newCity = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
  };

  db.City.create(newCity, function(err, newCity) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(newCity);
  });
});
//TODO delete city

/////////////
/// USERS ////
////////////

//get all users
router.get('/users', function(req, res) {
  db.User.find({}, function(err, users) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(users);
  });
});

//get one user
router.get('/users/:id', function(req, res) {
  db.User
    .findById(req.params.id)
    .populate('hometown')
    .exec(function(err, user) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(user);
    });
});

//create user
router.post('/users', function(req, res) {
  console.log('user create', req.body);

  var newUser = {
    username: req.body.username,
    password: req.body.password,
    hometown: req.body.hometown,
    image: req.body.image
  };

  db.User.create(newUser, function(err, newUser) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(newUser);
  });
});
//TODO delete user

/////////////
/// POSTS ////
////////////

//get all posts
router.get('/posts', function(req, res) {
  db.Post.find({}, function(err, posts) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(posts);
  });
});

//get one post
router.get('/posts/:id', function(req, res) {
  db.Post
    .findById(req.params.id)
    .populate('_user _city')
    .exec(function(err, post) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(post);
    });
});

//create post
router.post('/posts', function(req, res) {
  console.log('post create', req.body);

  var newPost = {
    _user: req.body._user,
    _city: req.body._city,
    title: req.body.title,
    text: req.body.text
  };

  db.Post.create(newPost, function(err, newPost) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(newPost);
  });
});
//TODO delete post

/////////////////////////////////////////////////////////
/*router
  .route('/cities/:id/posts')
  .get(function(req, res) {
    db.Post.find({ cityId: req.body.cityId }, function(err, posts) {
      if (err) res.status(500).json({ error: err.message });
      res.json(posts);
    });
  });

router
  .route('/posts')
  .post(function(req, res) {
    var post = new Post();
    post.save(function(err) {
      if (err) res.status(500).json({ error: err.message });
      res.json({ message: 'Post successfully added!' });
    });
  });

router
  .route('/posts/:postId')
  .get(function(req, res) {
    Post.findById(req.params.postId, function(err, posts) {
      if (err) res.status(500).json({ error: err.message });
      res.json(posts);
    });
  })
  .put(function(req, res) {
    Post.findById(req.params.postId, function(err, post) {
      if (err) res.status(500).json({ error: err.message });
      post.title = req.body.title;
      post.text = req.body.text;
      post.cityId = req.body.cityId;

      post.save(function(err) {
        if (err) res.status(500).json({ error: err.message });
        res.json({ message: 'post has been updated' });
      });
    });
  })
  .delete(function(req, res) {
    Post.remove({ _id: req.params.postId }, function(err, post) {
      if (err) res.status(500).json({ error: err.message });
      res.json({ message: 'Post has been deleted' });
    });
  });
*/
//use router config when we call /API
app.use('/api', router);

//start server
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
