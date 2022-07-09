import React, { useContext, useEffect, useState } from 'react'
import { storage, firestore, database } from "../firebase";
import {useParams} from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import {AuthContext} from "../AuthProvider"
import Navbar from './NavBar';
import { makeStyles } from "@material-ui/styles";
import VideoModal from './VideoModal';
import { Dialog } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import {
    Paper,
    Grid,
    Container,
    Card,
    CardMedia,
    TextField,
    Typography} from "@mui/material";
const useStyles=makeStyles({
    maindiv:{
        border:"1 px solid black",
        marginTop:"8vh",
        height:"92vh",
        marginLeft:"18%",
        marginRight:"18%"
          
    },
    upperdiv:{
        display:"flex",
        height:"30%",
       
    },
    profilearea:{
        height:"100%",
        width:"50%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    infoarea:{
        height:"100%",
        width:"50%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"column"
    },
    postdiv:{
        display:"flex",
        flexWrap:"wrap"
    }
})
function Profile() {
    const {id} = useParams()
    const [open, setOpen] = React.useState(null);
    const {logout,user} = useContext(AuthContext);
    const [userdata,setUserData]=useState(null);
    const [postarr,setPostArr]=useState(null);
    async function GetUserData(){
        await database.users.doc(id).onSnapshot(function (snapshot) {
            setUserData(snapshot.data());
           
          });
        
    }
    const handleClickOpen = (postid) => {
        setOpen(postid);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
   let classes=useStyles();
    async function GetPosts(){
      
        if(userdata!=null)
        {
            let arr=[];
            let allpostid=userdata.postids;
            for(let i=0;i<allpostid.length;i++)
            {
                console.log(i+" "+allpostid[i])
               let dataref=await database.posts.doc(allpostid[i]).get();
                    let postid=allpostid[i];
                    console.log(postid)
                    let data=dataref.data();
                    let likesarr = data.likes;
                  let commentarr=data.comments;
                  let purl = data.Purl;
                  let uid = data.uid;
                  let obj={
                      postid,
                      data,
                      likesarr,
                      commentarr,
                      purl,
                      uid
                  }
                    arr.push(obj);   
                   
            }
            setPostArr(arr); 
          
        }
    }
    useEffect(function(){
              GetUserData();
              return ()=>{
                  console.log("clean up");
              }
    },[id])
useEffect(()=>{
  
    GetPosts();
    return ()=>{
        console.log("clean up");
    }
},[userdata])
   
  return (
    <div>
        {userdata==null || postarr==null ? <CircularProgress></CircularProgress> : 
           <>
          <Navbar logout={logout} userdata={userdata} ></Navbar> 
          <div className={classes.maindiv}>
              <div className={classes.upperdiv} >
                  <div className={classes.profilearea}>
                  <Avatar
                        alt="Remy Sharp"
                        src={userdata.profileurl}
                        sx={{ width: "8rem", height: "8rem" }}
                      />
                  </div>
                  <div className={classes.infoarea}>
                      <Typography variant='h5' style={{marginRight:"25%"}}>
                      Email : {userdata.email}
                      </Typography>
                      <Typography variant='h5'style={{marginRight:"25%"}} >
                      Posts : {userdata.postids.length}
                      </Typography>
                  </div>
              </div>
              <hr style={{marginTop:"1rem", marginBottom:"1rem"}} ></hr>
              <div className="postsdiv">
                  {
                      postarr.map(function(videobj){
                          console.log(postarr.length);
                        return (
                            <>
                        <video
                        style={{ height: "20rem",padding:"2rem"}}
                        muted="true"
                        autoPlay={true}
                        onClick={()=>{handleClickOpen(videobj.postid)}}
                      >
                        <source src={videobj.purl} type="video/mp4"></source>
                      </video>
                         
                         <Dialog
                         open={open==videobj.postid}
                         onClose={handleClose}
                         aria-labelledby="alert-dialog-title"
                         aria-describedby="alert-dialog-description"
                         maxWidth='md'
                         fullWidth={true}
                       >
                        <VideoModal GetPosts={GetPosts} videobj={videobj} user={user} reelsarr={postarr} userdata={userdata} ></VideoModal>
                       </Dialog>
                       </>
                        )
                      })
                  }
              </div>
          </div>
           </>  }
    </div>
  )
}

export default Profile