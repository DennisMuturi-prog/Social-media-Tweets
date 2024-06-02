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
     const tweetsRef = collection(db, "tweets");
    

    const getTweets = async () => {
       const q = query(
         tweetsRef,
         where("WriterId", "==", userId ? userId : auth.currentUser.uid),
         orderBy("createdAt", "asc")
       );
       const unsubTweets = onSnapshot(
         q,
         (querySnapshot) => {
           querySnapshot.docChanges().forEach((change) => {
             if (change.type === "added") {
               setTweets((currentTweets) => [
                 { ...change.doc.data(), id: change.doc.id },
                 ...currentTweets,
               ]);
             } else if (change.type === "modified") {
               setTweets((prevTweets) => {
                 return prevTweets.map((tweet) =>
                   tweet.id === change.doc.id
                     ? { ...change.doc.data(), id: change.doc.id }
                     : tweet
                 );
               });
             }
           });
         },
         (error) => {
           console.error(error);
           setErrorMessage(error.message);
         }
       );   
       return unsubTweets;
    };
     useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
             getTweets().then((unsubTweets)=>{
              return ()=>{
                unsubTweets();
                unsubscribe();
              }
             })
             
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