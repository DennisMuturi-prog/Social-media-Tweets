import { collection,getDocs,where,query } from "firebase/firestore";
import { db,auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import Tweet from "./Tweet";

const Explore = () => {
    const [tweets,setTweets]=useState([]);
    const getTweets = async () => {
      const tweetsRef = collection(db, "tweets");
      const q = query(tweetsRef, where("WriterId", "!=", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs);
      const tweetsData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
      setTweets(tweetsData);
    };
    useEffect(()=>{
        getTweets().then((data)=>{
            console.log(data);
        }).catch((error)=>{
            console.log(error);
        })

    },[])
  return (
    <div>
        {tweets.map((tweet,id)=>(
            <Tweet key={id} tweetDetails={tweet}/>
        ))}
    </div>
  )
}

export default Explore