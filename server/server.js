const path = require("path");
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local");

// const db = require("./db");

const PORT = process.env.PORT || 8080;
const app = express();

console.log("PROCESS.ENV", process.env);

if (process.env.NODE_ENV !== "production") require("../env-variables.json");

passport.use(
  new LocalStrategy(function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

const createApp = () => {
  app.use(morgan("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "hot water bottles",
      store: sessionStorage,
      resave: false,
      saveUninitialized: false
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/index.html"));
  });

  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error");
  });
};

app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });


const startListening = () => {
  const server = app.listen(PORT, () => {
    console.log(`express server listening on port ${PORT}`);
  });
};

async function bootApp() {
  await createApp();
  await startListening();
}

if (require.main === module) {
  bootApp();
} else {
  createApp();
}
