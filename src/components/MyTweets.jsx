import { collection,where,query, onSnapshot, orderBy, getDocs} from "firebase/firestore";
import { db,auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Tweet from "./Tweet";
import { AlertDestructive } from "./AlertDestructive";
import  {CreateTweet}  from "./CreateTweet";
const MyTweets = ({userId}) => {
    const [tweets,setTweets]=useState([]);
    const [errorMessage,setErrorMessage]=useState('');
     const getTweets = async () => {
       const tweetsRef = collection(db, "tweets");
       const q = query(
         tweetsRef,
         where("WriterId", "==", userId?userId:auth.currentUser.uid),
         orderBy('createdAt','desc')
       );
       /*getDocs(q).then((querySnapshot) => {
         const tweetsData = querySnapshot.docs.map((doc) => ({
           ...doc.data(),
           id: doc.id,
         }));
         setTweets(tweetsData);
       });*/
       /*onSnapshot(q, (querySnapshot) => {
         querySnapshot.docChanges().forEach((change) => {
           if (change.type === "added" || change.type === "modified") {
             setTweets((prevTweets) => {
               const newTweet = { ...change.doc.data(), id: change.doc.id };
               // If the tweet already exists in the state, replace it
               if (prevTweets.some((tweet) => tweet.id === newTweet.id)) {
                 return prevTweets.map((tweet) =>
                   tweet.id === newTweet.id ? newTweet : tweet
                 );
               }
               // If the tweet doesn't exist in the state, add it
               else {
                 return [newTweet, ...prevTweets];
               }
             });
           }
         });
       });*/
       /*onSnapshot(q,(querySnapshot) => {
         const tweetsData = querySnapshot.docs.map((doc) => ({
           ...doc.data(),
           id: doc.id,
         }));
         setTweets(tweetsData);
       }
       )*/
       const tweetsData = [];

       const querySnapshot = await getDocs(q);
       const tweetPromises = querySnapshot.docs.map(async (doc) => {
         const tweetData = doc.data();
         const interactionData = await setInteractionsCorrect(doc.id);
         tweetsData.push({ ...tweetData, ...interactionData,id:doc.id});
       });

       await Promise.all(tweetPromises);

       setTweets(tweetsData);
        const q2= query(
          tweetsRef,
          where("WriterId", "==", userId ? userId : auth.currentUser.uid),
        );
       onSnapshot(q2, (querySnapshot) => {
         querySnapshot.docChanges().forEach((change) => {
           if (change.type === "added" || change.type === "modified") {
             setTweets((prevTweets) => {
               const newTweet = { ...change.doc.data(), id: change.doc.id };
               // If the tweet already exists in the state, replace it
               const tweetIndex = prevTweets.findIndex(
                 (tweet) => tweet.id === newTweet.id
               );
               if (tweetIndex !== -1) {
                 const updatedTweets = [...prevTweets];
                 updatedTweets[tweetIndex] = newTweet;
                 return updatedTweets;
               }
               // If the tweet doesn't exist in the state, add it
               else {
                 return [newTweet, ...prevTweets];
               }
             });
           }
         });
       });
       
     };
     useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            getTweets()
              .then(() => {
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          }
        });
        return () => unsubscribe();

     },[])
     /*const setInteractionsCorrect = async (tweetId) => {
       const likesref = collection(db, "likes");
       const q = query(
         likesref,
         where("likerId", "==", auth.currentUser.uid),
         where("tweetId", "==", tweetId)
       );
       const querySnapshot = await getDocs(q);
       if (querySnapshot.docs.length > 0) {
         console.log(querySnapshot.docs[0].data());
         setTweetLikeRef(querySnapshot.docs[0].ref);
         setLiked(true);
       }
       const dislikesref = collection(db, "dislikes");
       const q2 = query(
         dislikesref,
         where("dislikerId", "==", auth.currentUser.uid),
         where("tweetId", "==", tweetId)
       );
       const querySnapshot2 = await getDocs(q2);
       if (querySnapshot2.docs.length > 0) {
         setTweetDislikeRef(querySnapshot2.docs[0].ref);
         setDisliked(true);
       }
       const retweetsref = collection(db, "retweets");
       const q3 = query(
         retweetsref,
         where("retweeterId", "==", auth.currentUser.uid),
         where("tweetId", "==", tweetDetails.id)
       );
       const querySnapshot3 = await getDocs(q3);
       if (querySnapshot3.docs.length > 0) {
         setTweetRetweetedRef(querySnapshot3.docs[0].ref);
         setRetweeted(true);
       }
     };*/
     const setInteractionsCorrect = async (tweetId) => {
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
     return (
    <>
    {errorMessage&&<AlertDestructive errorMessage={errorMessage}/>}
      <div>
        {tweets.length==0&&<h1 className="text-center font-medium text-lg">You have no tweets...</h1>}
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweetDetails={tweet} ismyTweet={userId?false:true} setErrorMessage={setErrorMessage} />
        ))}
        {!userId&&<CreateTweet/>}
      </div>
    </>
  );
}

export default MyTweets