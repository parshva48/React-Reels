import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
let obj=require("./secrets");
firebase.initializeApp(obj);
let auth=firebase.auth();
export default auth;
export const firestore = firebase.firestore();
export const database = {
    users: firestore.collection("users"),
    posts: firestore.collection("posts"),
    comments: firestore.collection("comments"),
    getUserTimeStamp: firebase.firestore.FieldValue.serverTimestamp
}
export const storage = firebase.storage();