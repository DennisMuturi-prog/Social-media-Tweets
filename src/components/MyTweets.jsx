import { collection,where,query, onSnapshot} from "firebase/firestore";
import { db,auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Tweet from "./Tweet";
import { AlertDestructive } from "./AlertDestructive";
const MyTweets = () => {
    const [tweets,setTweets]=useState([]);
    const [errorMessage,setErrorMessage]=useState('');
     const getTweets = async () => {
       const tweetsRef = collection(db, "tweets");
       const q = query(
         tweetsRef,
         where("WriterId", "==", auth.currentUser.uid)
       );
       const unsub=onSnapshot(q,(querySnapshot)=>{
        const tweetsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTweets(tweetsData);
       })
       
     };
     useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            getTweets()
              .then((data) => {
                console.log(data);
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
        {tweets.map((tweet, id) => (
          <Tweet key={id} tweetDetails={tweet} ismyTweet={true} setErrorMessage={setErrorMessage} />
        ))}
      </div>
    </>
  );
}

export default MyTweets