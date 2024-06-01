import { collection,where,query, onSnapshot, orderBy, getDocs} from "firebase/firestore";
import { db,auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Tweet from "./Tweet";
import { AlertDestructive } from "./AlertDestructive";
import  {CreateTweet}  from "./CreateTweet";
import { setInteractionsCorrect } from "./Interactions";
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