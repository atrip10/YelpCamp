var express=require("express");
var router = express.Router({mergeParams: true});
var Campground=require("../models/campground");
var middleware=require("../middleware");
var Comment=require("../models/comment");

router.get("/new",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    });
});

// Create Route
router.post("/",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,campground)=>{
		if(err){
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment,(err,comment)=>{
				if(err){
					req.flash("error","Something went wrong!!")
					console.log(err);
				}else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment!!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCampground,(req,res)=>{
	Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id: req.params.id,comment:foundComment});
		}
	})
})

router.put("/:comment_id",middleware.checkCampground,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedcomment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

router.delete("/:comment_id",middleware.checkCampground,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted!!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

module.exports=router;