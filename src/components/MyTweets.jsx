import { collection,where,query, onSnapshot, orderBy} from "firebase/firestore";
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
              .then(() => {
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          }
        });
        return () => unsubscribe();

     },[])
     console.log(tweets);
  return (
    <>
    {errorMessage&&<AlertDestructive errorMessage={errorMessage}/>}
      <div>
        {tweets.length==0&&<h1 className="text-center font-medium text-lg">You have no tweets...</h1>}
        {tweets.map((tweet, id) => (
          <Tweet key={id} tweetDetails={tweet} ismyTweet={userId?false:true} setErrorMessage={setErrorMessage} />
        ))}
        {!userId&&<CreateTweet/>}
      </div>
    </>
  );
}

export default MyTweets