import React, { useEffect, useState } from 'react'
import FavouriteIcon from "@mui/icons-material/Favorite";
import { storage, firestore, database } from "../firebase";
import { makeStyles } from "@material-ui/styles";
function Likes2({videobj,reelsarr,user,getPosts}) {
    const [isliked,SetLike]=useState(false);
    useEffect(function(){

        let check=videobj.likesarr.includes(user.uid) ? true : false;
        SetLike(check);
    
    },[reelsarr])
    let useStyles=makeStyles({
        likediv:{
        },
        nocolor: {
            color: "lightgrey",
            cursor:"pointer",
            paddingTop:"0.5rem"
          },
          color: {
            color: "red",
            cursor:"pointer",
            paddingTop:"0.5rem"
          },

    })
let classes=useStyles();
    async function HandleLikes(postid) {
        let likesarr = [...videobj.likesarr];
        if (isliked == true) {
          likesarr = likesarr.filter(function (id) {
            return id != user.uid;
          });
          await database.posts.doc(postid).update({
            likes: [...likesarr],
          });
        } else {
          await database.posts.doc(postid).update({
            likes: [...likesarr, user.uid],
          });
        }
        getPosts()
      }
  return (
    <div>
    <FavouriteIcon
      fontSize="large"
      className={
        isliked == true ? classes.color : classes.nocolor
      }
      onClick={() => {
        HandleLikes(videobj.postid);
      }}
    ></FavouriteIcon>
  </div>
  )
}

export default Likes2