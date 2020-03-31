var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var Campground=require("./models/campground");
var flash=require("connect-flash");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seed");

var campgroundRoutes=require('./routes/campgrounds');
var commentRoutes=require("./routes/comments");
var indexRoutes=require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp",({ useNewUrlParser: true,useUnifiedTopology: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

app.use(require("express-session")({
	secret: "Rusty is the cutest dog",
	resave: false,
	saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000,()=>{
	console.log("Connected to YelpCamp");
});