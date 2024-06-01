import { collection,onSnapshot,where,query, orderBy,getDocs } from "firebase/firestore";
import { db,auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import { onAuthStateChanged } from "firebase/auth";
import { AlertDestructive } from "./AlertDestructive";
import { setInteractionsCorrect } from "./Interactions";

const Explore = () => {
    const [tweets,setTweets]=useState([]);
    const [errorMessage,setErrorMessage]=useState('');
    /*const getTweets = async () => {
      const tweetsRef = collection(db, "tweets");
      const q = query(tweetsRef, where("WriterId", "!=", auth.currentUser.uid),where('parentTweetId','==',false),orderBy('createdAt','desc'));
     const unsub = onSnapshot(q, (querySnapshot) => {
       const tweetsData = querySnapshot.docs.map((doc) => ({
         ...doc.data(),
         id: doc.id,
       }));
       setTweets(tweetsData);
     });
    };*/
     const getTweets = async () => {
       const tweetsRef = collection(db, "tweets");
       const q = query(
         tweetsRef,
         where("WriterId", "!=",auth.currentUser.uid),
         orderBy("createdAt", "desc")
       );
       const tweetsData = [];

       const querySnapshot = await getDocs(q);
       const tweetPromises = querySnapshot.docs.map(async (doc) => {
         const tweetData = doc.data();
         const interactionData = await setInteractionsCorrect(doc.id);
         tweetsData.push({ ...tweetData, ...interactionData, id: doc.id });
       });

       await Promise.all(tweetPromises);

       setTweets(tweetsData);
       const q2 = query(
         tweetsRef,
         where("WriterId", "!=",auth.currentUser.uid)
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
        const unsubscribe=onAuthStateChanged(auth,(currentUser)=>{
            if(currentUser){
                getTweets()
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((error) => {
                    setErrorMessage(error.message);
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