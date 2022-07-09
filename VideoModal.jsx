import React, { useEffect, useState } from 'react'
import {
  Button,
  Paper,
  Grid,
  Container,
  Card,
  CardMedia,
  TextField,
  Typography} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CircularProgress from '@mui/material/CircularProgress';
import CardContent from "@mui/material/CardContent";
import { storage, firestore, database } from "../firebase";
import { makeStyles } from "@material-ui/styles";
import { Avatar } from "@mui/material";
import Likes2 from './Likes2';

function VideoModal({videobj,reelsarr,user,userdata,GetPosts}) {
  const [text,SetText]=useState("");
  const [commentdata,SetCommentData]=useState([]);
  async function AddComment(){
    let obj={
      text,
      username:userdata.username,
      profileurl:userdata.profileurl,
      createdAt: database.getUserTimeStamp(),
    }
    let commentobj = await database.comments.add(obj);
    let cid = commentobj.id;
    let commentarr=videobj.commentarr;
    await database.posts.doc(videobj.postid).update({
      comments: [...commentarr, cid],
    });
    SetText("");
    GetPosts();


  }
  async function HandleComments(){
    let commentarr=videobj.commentarr;
    let arr=[];
    for(let i=0;i<commentarr.length;i++)
    {
      let cdata=await database.comments.doc(commentarr[i]).get();
      cdata=cdata.data();
      arr.push(cdata);
    }
   arr.sort((a,b)=>{
      return b.createdAt-a.createdAt;
    })
    SetCommentData(arr);

  }
  useEffect(function(){
     HandleComments();
    return ()=>{
      console.log("unmounted")
    } 

  },[reelsarr])
  let useStyles=makeStyles({
    videoModal:{
      height:"100%",
      width:"100%",
      display:"flex"
    },
    videocontainer:{
      height:"100%",
      width:"50%",
      display:"flex",
      justifyContent:"center",
      alignContent:"center"
       
    },
    commtentcontainer:{
      height:"100%",
      width:"50%",

    }

  })
let classes=useStyles();
  return (
    <div className={classes.videoModal} >
      <div className={classes.videocontainer}>
      <video
        style={{ height: "70vh"}}
        controls
        autoPlay={true}
        muted="true"
      >
        <source src={videobj.purl} type="video/mp4"></source>
      </video>
      </div>
      <div className={classes.commtentcontainer}>
        <Card style={{height:"60vh"}} variant="outlined" >
          <div style={{marginTop:"0.5rem"}}>
           {
             commentdata.map(function(comment){
              
              return(
                  <div style={{display:'flex'}}>
                    <Avatar src={comment.profileurl}></Avatar>
                    <p>&nbsp;&nbsp;<span style={{fontWeight:'bold'}}>{comment.username}</span>&nbsp;&nbsp; {comment.text}</p>
                  </div>
              )

             })
           }


          </div>
        </Card>
        <Card variant='outlined'  >
        <Typography textAlign="center" style={{fontWeight: "bold",paddingTop: "0.5rem"}} >
          {videobj.likesarr.length==0 ? `` : `Liked By ${videobj.likesarr.length} users`}
        </Typography>
        <div style={{display:"flex",justifyContent:"space-evenly"}} >
        <Likes2 getPosts={GetPosts}videobj={videobj} reelsarr={reelsarr} user={user} ></Likes2>
        <TextField id="standard-basic" label="Comment" variant="standard" value={text} onChange={(e)=>{SetText(e.target.value)}} />
        <Button variant="outlined" size='large' onClick={AddComment} >Post</Button>
        </div>
        </Card>
       
      </div>
    </div>
  )
}

export default VideoModal