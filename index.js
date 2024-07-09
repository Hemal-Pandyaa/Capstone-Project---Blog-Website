// TODO: Add word count at creatBlog page width ::after
// TODO: Have an actual footer that suggest some blogs to read
// TODO: Make myBlogs page secure so that only i can manage my own blogs not eveyone in the world
// FIXME: While removing character at creatBlog page camera is stuck

import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
//* nodemailer for cotact us page
import nodemailer from "nodemailer";
import { deleteBlog, getBlogById, getBlogByUserId } from "./public/backend/blogs.js";
import dotenv from "dotenv";
import { getCurrentUser, logOut, signIn, signUp } from "./public/backend/auth.js";
dotenv.config()

const app = express();
app.set('view engine', 'ejs')
const port = process.env.PORT || 3000;
const blogs = [["What is the purpost of life??", "asjflasjdflkasjdlfjalsdf","ajsdlfkajlskjflasjdf"], ["Learning how to learn", "aslkdfjaslkdfjalksdjf", "skjfasjdflasjdlfajsldf"]];

app.use( async (req, res, next) => {
    const currentUser = await getCurrentUser();
    res.locals.loggedIn = currentUser ? currentUser : false;
    res.locals.user = currentUser
    next();
});

async function sendMail(name,mail,message){
    const config = {
        service : "gmail",
        host: "smtp.gmail.com",
        port : 465,
        secure: true,
        auth: {
            user : process.env.mail,
            pass: process.env.pass,
        },
    };
    console.log(config)
    const data = {
        to: process.env.mail,
        subject: mail,
        text: message + `\n\n\n\n\nSend by, ${name}`,
    }
    const transporter = nodemailer.createTransport(config)
    transporter.sendMail(data, (err, info) => {
        if(err){
            console.log(err);
        }
    })

}


app.use(express.static("public"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get("/", (req,res) => {
    res.render("index.ejs")
});

app.get("/contact", (req,res) => {
    res.render("contact.ejs");
});

app.post("/submit",async (req,res) => {
    
    res.render("submit.ejs");
    var fullName = req.body["fullName"];
    var email = req.body["email"];
    var message = req.body["message"];
    await sendMail(fullName,email,message);
    res.status(200)
})

app.get("/myBlogs",(req,res)=>{
    let data = {
        blogs: getBlogByUserId(res.locals.user.uid)
    };
    res.render("myBlogs.ejs", data);
    res.status(200)
})

app.get("/myBlogs/create", (req,res) => {
    res.status(200);
    res.render("createBlog.ejs");
});

app.post("/submitBlog", (req,res) => {
    res.render("submit.ejs");

    let title = req.body["title"];
    let about = req.body["about"];
    let content = req.body["blog"];

    createBlog(title, about, content)

    res.status(200)

});

app.delete(`/myBlogs/delete/:id`, (req,res) => {
    var id = req.params.id;
    deleteBlog(id);
});

app.put("/myBlogs/edit/:i", (req, res) => {
    var i = req.params.i;
    const data = {
        blog: getBlogById(i),
        id : i
    };
    res.render("editBlog.ejs", data);
});

app.get("/login" , (req, res) => {
    res.render("login.ejs");
})

app.post("/authLogin" , (req, res) => {
    signIn(req.body?.email, req.body?.password);
    res.redirect("/");
})

app.get("/signUp" , (req, res) => {
    res.render("signUp.ejs");
})

app.post("/authSignUp" , (req, res) => {
    signUp(req.body?.email, req.body?.password, req.body?.name);
    res.redirect("/")
})

app.get("/logOut", (req, res) => {
    logOut();
    res.redirect("/");
})

app.get("/error", (req,res) => {
    res.send("<h1> An error Ocuured </h1>");
});


app.listen(port, () => {
    console.log(`Server Running On Port ${port}`);
});

