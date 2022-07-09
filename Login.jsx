import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthProvider";
import { makeStyles } from "@material-ui/styles";
import { Paper, Grid, Container, Card, CardMedia, TextField,Typography } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom"
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext,Image } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import bg from '../Assets/insta.png'
import img1 from '../Assets/img1.jpg';
import img2 from '../Assets/img2.jpg';
import img3 from '../Assets/img3.jpg';
import img4 from '../Assets/img4.jpg';
import img5 from '../Assets/img5.jpg';
import "./Login.css"
import reele from "../Assets/reele2.png"

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const { login } = useContext(AuthContext);
  function HandleEmail(e) {
    setEmail(e.target.value);
  }
  function HandlePassword(e) {
    setPassword(e.target.value);
  }
  async function HandleSumbit(e) {
    setLoader(true);
    await login(email, password);
    props.history.push("/");
    setLoader(false);
    console.log("hii");
    //setLoader(false);

    // setEmail(e.target.value);
    //e.preventDefault();
  }

  let useStyle = makeStyles({
   
    border: {
      border: "1px solid black",
    },
    gridstyle: {
      height: "60%",
      justifyContent: "center",
    },
   
    Cards: {
      display: "flex",
      flexDirection: "column",
    },
    Card: {
      display: "flex",
      flexDirection: "column",
      width: "50%",
      marginTop:"0.5rem"
    },
    Buttons: {
      width: "100%",
    },
    ImageProp:{
        height:"5rem",
        backgroundSize:"contain",
    }
  });
  let classes = useStyle();

  console.log("inside login");
  return (
    <>
      <div className="center-div">
            <div className="slider-div">
            <div className="imgcar" style={{backgroundImage:'url('+bg+')',backgroundSize:'cover'}}>
          <div className="car">
                <CarouselProvider
                    visibleSlides={1}
                    totalSlides={5}
                    // step={3}
                    naturalSlideWidth={238}
                    naturalSlideHeight={423}
                    hasMasterSpinner
                    isPlaying={true}
                    infinite={true}
                    dragEnabled={false}
                    touchEnabled={false}
                >
                    <Slider>
                    <Slide index={0}><Image src={img1}/></Slide>
                    <Slide index={1}><Image src={img2}/></Slide>
                    <Slide index={2}><Image src={img3}/></Slide>
                    <Slide index={3}><Image src={img4}/></Slide>
                    <Slide index={4}><Image src={img5}/></Slide>
                    </Slider>
                </CarouselProvider>
              </div>
          </div>
            </div>
         
            <div className="outerdiv">
              <Card variant="outlined" className={classes.Card}>
                <CardMedia 
                  image={reele}
                 title="Icon"
//"https://github.com/Jasbir96/Batches/blob/main/PAB/React/5_React_Reels/reels/src/1024px-Instagram_logo.svg.png?raw=true"
                  className={classes.ImageProp}
                />
                <CardContent className={classes.Cards}>
                  <TextField
                    id="outlined-basic"
                    margin="dense"
                    placeholder="Enter Email"
                    label="Email"
                    size="small"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={HandleEmail}
                  />
                  <TextField
                    id="outlined-basic"
                    margin="dense"
                    placeholder="Password"
                    label="Password"
                    size="small"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={HandlePassword}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    className={classes.Buttons}
                    color="primary"
                    size="large"
                    onClick={HandleSumbit}
                  >
                    LogIn
                  </Button>
                </CardActions>
              </Card>
               <Card className={classes.Card}  variant="outlined">
                 <Typography style={{
                   textAlign:"center"
                 }}>
                 Don't have an account?
                 <span style={{color:"blue"}}> 
                 <Link to="/signup" style={{textDecoration:"none"}} >SignUp</Link></span>
                 </Typography>
                
               </Card>

            </div>
      </div>
      {/* <h1>FireBase Login</h1>
            <div>
            <input type="email" value={email} onChange={HandleEmail}/>
            </div>
          <div>
          <input type="password" value={password} onChange={HandlePassword}  />
          </div>
          <button onClick={HandleSumbit}>Login</button> */}
    </>
  );
}
