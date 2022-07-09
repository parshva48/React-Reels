import React, { useEffect, useState } from 'react'
import FavouriteIcon from "@mui/icons-material/Favorite";
import { storage, firestore, database } from "../firebase";
import { makeStyles } from "@material-ui/styles";
function Likes({videobj,reelsarr,user}) {
const [isliked,SetLike]=useState(false);
 
useEffect(function(){

    let check=videobj.likesarr.includes(user.uid) ? true : false;
    SetLike(check);

},[reelsarr])

    let useStyles=makeStyles({
        likediv:{
            position: "absolute",
            bottom: "5%",
            left: "6%",

        },
        nocolor: {
            color: "white",
            cursor:"pointer"
          },
          color: {
            color: "red",
            cursor:"pointer"
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
      }
  return (
    <div className={classes.likediv}>
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

export default Likes