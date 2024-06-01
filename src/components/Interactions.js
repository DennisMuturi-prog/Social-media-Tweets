 import { getDocs,collection,query,where } from "firebase/firestore";
 import {db,auth} from '../config/firebase'
 export const setInteractionsCorrect = async (tweetId) => {
       const likesRef = collection(db, "likes");
       const dislikesRef = collection(db, "dislikes");
       const retweetsRef = collection(db, "retweets");

       const likesQuery = query(
         likesRef,
         where("likerId", "==", auth.currentUser.uid),
         where("tweetId", "==", tweetId)
       );

       const dislikesQuery = query(
         dislikesRef,
         where("dislikerId", "==", auth.currentUser.uid),
         where("tweetId", "==", tweetId)
       );

       const retweetsQuery = query(
         retweetsRef,
         where("retweeterId", "==", auth.currentUser.uid),
         where("tweetId", "==", tweetId)
       );

       const [likesSnapshot, dislikesSnapshot, retweetsSnapshot] =
         await Promise.all([
           getDocs(likesQuery),
           getDocs(dislikesQuery),
           getDocs(retweetsQuery),
         ]);

       const tweetLikeRef =
         likesSnapshot.docs.length > 0 ? likesSnapshot.docs[0].ref : null;
       const tweetDislikeRef =
         dislikesSnapshot.docs.length > 0 ? dislikesSnapshot.docs[0].ref : null;
       const tweetRetweetRef =
         retweetsSnapshot.docs.length > 0 ? retweetsSnapshot.docs[0].ref : null;
       return {
         tweetLikeRef,
         tweetDislikeRef,
         tweetRetweetRef,
       };
     };