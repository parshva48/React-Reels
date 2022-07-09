import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider";
import VideoModal from "./VideoModal";
import { storage, firestore, database } from "../firebase";
import { makeStyles } from "@material-ui/styles";
import CircularProgress from '@mui/material/CircularProgress';
import ReactDOM from 'react-dom'
import "./extra.css"
import {
  Paper,
  Grid,
  Container,
  Card,
  CardMedia,
  TextField,
  Typography} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import uuid from "react-uuid";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { Avatar } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Likes from "./Likes";
import NavBar from "./NavBar";
export default function Feed(props) {
  // console.log(props);
  let { logout, user } = useContext(AuthContext);
  const [open, setOpen] = React.useState(null);
  const [loader, setLoader] = useState(false);
  const [reelsarr, setReels] = useState([]);
  const [pageloader, setPageLoader] = useState(true);
  const [userdata, setUserData] = useState(null);
  const [postidarr, setPostArr] = useState([]);
  const [isliked,SetIsLike]=useState(false);
  

  function HandleFile(e) {
    e.preventDefault();
    let tmpfile = e?.target?.files[0];
    if (tmpfile != null) {
      try {
        if (tmpfile.size / (1024 * 1024) > 20) {
          alert("The selected file is very big");
          return;
        }
        setLoader(true);
        let uid = user.uid;
        console.log("inisdie uploading");
        const uploadTaskListener = storage.ref(`/posts/${uuid()}`).put(tmpfile);
        uploadTaskListener.on("state_changed", fn1, fn2, fn3);
        //fn1=>progress
        //fn2=> error
        //fn3=>success
        function fn1(snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        }
        function fn2(error) {
          setLoader(false);
        }
        async function fn3() {
          let url = await uploadTaskListener.snapshot.ref.getDownloadURL();
          let obj = {
            likes: [],
            comments: [],
            uid: user.uid,
            Purl: url,
            createdAt: database.getUserTimeStamp(),
          };
          let postobj = await database.posts.add(obj);
          let pid = postobj.id;
          await database.users.doc(user.uid).update({
            postids: [...userdata.postids, pid],
          });
          setLoader(false);
        }
      } catch (err) {
        setLoader(false);
        console.log(err);
      }
    }
  }
  const handleClickOpen = (postid) => {
    setOpen(postid);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  async function HandleProfile() {
    database.users.doc(user.uid).onSnapshot(function (snapshot) {
      setUserData(snapshot.data());
      setPageLoader(false);
    });
  }
  async function GetAllPosts() {
     firestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot(async function (snapshot) {
        let tmparr = [];
        console.log(snapshot.docs.length);
        let videos = snapshot.docs.map(function(docs){return docs.data()})
        for(let i =0;i<videos.length; i++){
        let eachposts =videos[i];
          let postid = snapshot.docs[i].id;
          let purl = eachposts.Purl;
          let uid = eachposts.uid;
          let likesarr = eachposts.likes;
          let commentarr=eachposts.comments;
         let dataref= await database.users.doc(uid).get();
         let data = dataref.data();
         let username = data.username;
         let profileurl = data.profileurl;
         let obj = {
           purl,
           username,
           profileurl,
           postid,
           likesarr,
           commentarr

         };
         tmparr.push(obj);
        // console.log(tmparr.length);
    }
    setReels(tmparr);        
        
      });
  }
  console.log(reelsarr);
  useEffect(() => {
    HandleProfile();
    GetAllPosts();
    // let dataObject = await database.users.doc(user.uid).get();
    // // console.log(dataPromise.data());
    // setUserData(dataObject.data());
    // setPageLoader(false);
    return () => {
      console.log("hello");
    };
  }, []);

   function callback(entries){
       entries.map((entry)=>{
           let video=entry.target.childNodes[0];
           video.play().then(()=>{
               if(video.paused==false && entry.isIntersecting==false)
               {
                   video.pause()
               }
           })

       })

   }

    useEffect(()=>{
        let object={
            root:null,
            threshold:"0.6"
        }
        let observer=new IntersectionObserver(callback,object);
        let allelement=document.querySelectorAll(".videodiv");
        console.log(allelement);
        for(let i=0;i<allelement.length;i++)
        {
            observer.observe(allelement[i]);
        }


    },[reelsarr]) 

  let useStyles = makeStyles({
    
    chatIcon: {
      position: "absolute",
      bottom: "5%",
      left: "20%",
      color: "white",
      cursor:"pointer"
    },
    maindiv:{
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",

          
    },
    loaderdiv:{
        display:"flex",
        justifyContent:"center",
        alignContent:"center"
    }
  });
  let classes = useStyles();
  return (
    <>
      {pageloader == true ? (
       <div className={classes.loaderdiv}> <CircularProgress></CircularProgress></div>
      ) : (
        <>
        <NavBar logout={logout} userdata={userdata} ></NavBar>
          <div className={classes.maindiv}>
            <div style={{marginTop:"5rem",marginBottom:"2rem"}}>
              <Button
                variant="outlined"
                startIcon={<OndemandVideoIcon></OndemandVideoIcon>}
                style={{ marginTop: "0.5rem" }}
                color="secondary"
                component="label"
              >
                <Typography>Upload Profile Image</Typography>

                <input
                  type="file"
                  hidden
                  accept="file"
                  onChange={HandleFile}
                ></input>
              </Button>
            </div>
            <div className="reels-container">
                { 
                  <>
                  {reelsarr.map(function (videobj, idx) {
                      console.log(reelsarr.length);
                   return (
                  <div className="videodiv"
                     
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                   
                  >

                    <Video
                      src={videobj.purl}
                      username={videobj.username}
                      profileurl={videobj.profileurl}
                      idx={idx}
                    ></Video>
                    <div
                      style={{
                        position: "absolute",
                        color: "white",
                        fontSize: "1.5rem",
                        fontWeight: "bolder",
                        bottom: "16%",
                        left: "20%",
                      }}
                    >
                      {videobj.username}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "14%",
                        left: "4%",
                      }}
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src={videobj.profileurl}
                        sx={{ width: 50, height: 50 }}
                      />
                    </div>
                       
                       <Likes videobj={videobj}  reelsarr={reelsarr} user={user} ></Likes>         
                    <div className={classes.chatIcon}>
                      <ChatBubbleIcon
                        fontSize="large"
                        onClick={()=>{handleClickOpen(videobj.postid)}}
                      ></ChatBubbleIcon>
                      <Dialog
                        open={open==videobj.postid}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        maxWidth='md'
                        fullWidth={true}
                      >
                       <VideoModal  videobj={videobj} user={user} reelsarr={reelsarr} userdata={userdata} ></VideoModal>
                      </Dialog>
                    </div>
                  </div>
                );
              })}
                  </>
                }
                
            </div>
          </div>
        </>
      )}
    </>
  );
}

function Video(props) {
    const handleClick = (e) => {
        e.preventDefault();
        e.target.muted = !e.target.muted
    }
    const handleScroll = (e) => {
        let next = ReactDOM.findDOMNode(e.target).parentNode.nextSibling
        if(next){
            next.scrollIntoView({behavior:'smooth'});
            e.target.muted = true
        }
    }
  return (
    <>
      <video
        style={{ height: "80vh", 
        scrollSnapAlign: "start" }}
        controls
        onClick={handleClick}
        onEnded={handleScroll}
        muted="true"
        id={props.id}
      >
        <source src={props.src} type="video/mp4"></source>
      </video>
    </>
  );
}
