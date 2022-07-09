import React, { useContext, useState } from 'react'
import { AuthContext } from '../AuthProvider';
import { storage,firestore,database } from '../firebase';
import { makeStyles } from "@material-ui/styles";
import { Paper, Grid, Container, Card, CardMedia, TextField,Typography } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {Link} from "react-router-dom"
import Alert from '@mui/material/Alert';
import insta from './Instagram (1).jfif';
import reele from "../Assets/reele2.png"
import "./SignUp.css"

export default function SignUp(props) {
    const {SignUp}=useContext(AuthContext);
 const [email,setEmail]=useState("");
 const [username,setUsername]=useState("");
 const [password,setPassword]=useState("");
 const [file,setFile]=useState(null);
 const [loading,setloading]=useState(false);
 const [error,SetError]=useState(null);
 function HandleFile(e){
    let tmpfile=e?.target?.files[0];
    if(tmpfile!=null)
    {
        setFile(tmpfile);
    }
 }

async function HandleSumbit(e){
    e.preventDefault();
    try{
        setloading(true);
            let res=await SignUp(email,password);
            console.log(res);
            let uid=res.user.uid;
            const uploadTaskListener = storage.ref(`/users/${uid}/profileImage`).put(file);
            uploadTaskListener.on('state_changed', fn1, fn2, fn3);
            //fn1=>progress
            //fn2=> error
            //fn3=>success
            function fn1(snapshot) {
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(progress);
          }
          function fn2(error) {
            SetError(error);
            setloading(false);
        }
        async function fn3(){
          let  url=await uploadTaskListener.snapshot.ref.getDownloadURL();
          database.users.doc(uid).set({
           username,
           email,
           profileurl:url,
           createdAt:database.getUserTimeStamp(),
           userid:uid,
           postids:[]
  
          }
          )
          setloading(false);
          SetError(null);
          props.history.push("/");
        }
     
      }
      catch(err)
      {
        SetError("Email is already registered");
       
        setloading(false);
        
      }

     
 }
   
   let useStyles=makeStyles({
     centerdiv:{
       height:"100vh",
       display: "flex",
       flexDirection:"column",
       justifyContent: "center",
       alignItems: "center",
     }
     ,
     card:{
       width:"100%",
       display: "flex",
       flexDirection: "column",
    

     },
     imgdiv:{
      display: "flex",
      flexDirection:"column",
      justifyContent: "center",
      alignItems: "center",
       
     },
     image:{
       marginTop:"2%",
       height:"5rem"
     },
     ImageProp:{
      height:"5rem",
      backgroundSize:"contain",
  },
  Cards: {
    display: "flex",
    flexDirection: "column",
    width:"100%"
  },
     

   })
   let classes=useStyles();
   
  return (
    <div className={classes.centerdiv}>
      <div className="wrap-div">

      <Card variant='outlined' className={classes.card}>
        <div className={classes.imgdiv}>
         <img src={reele} className={classes.image} ></img>
          
        </div>
         <CardContent>
          <Typography variant='h6' style={{color:"gray"}}>
           Sign Up to see photos and videos from your friends
          </Typography>
          {error==null ? <></> : <Alert severity="error">{error}</Alert>}
          <TextField id="outlined-basic" fullWidth label="username" margin="dense" variant="outlined" type="text" 
            value={username}  onChange={function(e){
              setUsername(e.target.value);
              }}
          />
          <TextField id="outlined-basic" fullWidth label="email" margin="dense" variant="outlined" type="email"
              value={email}  onChange={function(e){
                setEmail(e.target.value);
            }}
          />
          <TextField id="outlined-basic" fullWidth label="password" margin="dense" type="password" variant="outlined"
              value={password} onChange={function(e){
                setPassword(e.target.value);
            }}        
           />
           <Button variant="outlined"  startIcon={<CloudUploadIcon></CloudUploadIcon>}  
           style={{width:"100%",marginTop:"0.5rem",color:"red"}}
           color="error"

           component="label">  
           <Typography>
           Upload Profile Image 
           </Typography>
           
           <input type="file" hidden accept='image/*' onChange={HandleFile}></input></Button>
      </CardContent>
      <CardActions>
                  <Button
                    variant="contained"
                    style={{width:"100%",marginTop:"-0.5rem"}}
                    color="primary"
                    size="large"
                    onClick={HandleSumbit}
                  >
                    SignUp
                  </Button>
                </CardActions>
          <Typography variant='subtitle1' style={{textAlign:"center",marginTop:"0.3rem"}}>
           By signing up.you agree our Terms,Data Policy and Cookies Policy. 
          </Typography>
      </Card>
      
      <Card className={classes.card}  variant="outlined">
                 <Typography style={{
                   textAlign:"center"
                 }}>
                  Have an account? 
                 <span style={{color:"blue"}}> 
                 <Link to="/login" style={{textDecoration:"none"}} > Log In </Link></span>
                 </Typography>
                
               </Card>

      </div>
     
       </div>

      /* <div>
          <label htmlFor="" id='1' >Username </label>
          <input type="text" value={username}id='1' onChange={function(e){
                 setUsername(e.target.value);
          }} />
         
    </div>
      <div>
      <label htmlFor="" id='2' >Email </label>
          <input type="email" value={email} id='2' onChange={function(e){
          setEmail(e.target.value);
      }}/></div>
      <div>
      <label htmlFor="" id='3' >Password </label>
          <input type="password"  value={password} onChange={function(e){
              setPassword(e.target.value);
          }} />
          
          </div>
      <div>
      <label htmlFor="" id='4' >Profile Image </label>
          <input type="file"  accept='image/*' onChange={HandleFile} />
          </div>
       
       <button type='sumbit' onClick={HandleSumbit} disabled={loading}>Sumbit</button>
 */


   
  )
}


