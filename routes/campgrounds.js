var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware/index.js");

router.get("/",(req,res)=>{	
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds});
		}
	});
});

router.post("/",middleware.isLoggedIn,(req,res)=>{
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username,
	}
	var newcampground={name:name, image:image,description:description,author:author};
	Campground.create(newcampground,(err,newlyCreated)=>{
		if(err){
			console.log(err);
		}
		else{
		    res.redirect("/campgrounds");
		}
	});
});

router.get('/new',middleware.isLoggedIn,(req,res)=>{
	res.render("campgrounds/new");
});

router.get("/:id",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:foundcampground});
		}
	});
});

//Edit Route

router.get("/:id/edit",middleware.checkCampground,(req,res)=>{
	    Campground.findById(req.params.id ,(err,foundcampground)=>{
			if(err){
				res.redirect("/campgrounds");
			}else{
	    	    res.render("campgrounds/edit",{campground: foundcampground});
			}
    	});
});

//Update Route 

router.put("/:id",middleware.checkCampground,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updateCampground)=>{
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
})

router.delete("/:id",middleware.checkCampground, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
    })
});

module.exports=router;