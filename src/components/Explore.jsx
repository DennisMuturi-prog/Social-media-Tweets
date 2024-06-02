import { collection,onSnapshot,where,query, orderBy,getDocs } from "firebase/firestore";
import { db,auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import { onAuthStateChanged } from "firebase/auth";
import { AlertDestructive } from "./AlertDestructive";

const Explore = () => {
    const [tweets,setTweets]=useState([]);
    const [errorMessage,setErrorMessage]=useState('');
    const tweetsRef = collection(db, "tweets");
    
    const getTweets =async () => {
      const q = query(
        tweetsRef,
        where("WriterId", "!=", auth.currentUser.uid),
        where("parentTweetId", "==", false),
        orderBy("createdAt", "asc")
      );
        const unsubTweets = onSnapshot(q, (querySnapshot) => {
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
        },(error)=>{
           console.error(error);
           setErrorMessage(error.message);
        });
        return unsubTweets;

    };
    
    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,(currentUser)=>{
            if(currentUser){
                getTweets().then((unsubTweets)=>{
                return ()=>{
                unsubTweets();
                unsubscribe()
                }
                });
                  
            }
        })
        return ()=>unsubscribe();
        

    },[])
  return (
    <>
    {errorMessage&&<AlertDestructive errorMessage={errorMessage}/>}
      <div>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweetDetails={tweet} setErrorMessage={setErrorMessage}/>
        ))}
      </div>
    </>
  );
}

export default Explore