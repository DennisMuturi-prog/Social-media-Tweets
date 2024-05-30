import { auth,db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import Tweet from "./Tweet";

const Following = () => {
  const [followingTweets,setFollowingTweets]=useState([]);
  const getFollowing=()=>{
    const followsRef=collection(db,'follows');
    const q=query(followsRef,where('followerId','==',auth.currentUser.uid));
    onSnapshot(q,(querySnapshot)=>{
      const ids=querySnapshot.docs.map((doc)=>(doc.data().followedId));
      console.log(ids);
      const tweetsRef=collection(db,'tweets');
      const q2=query(tweetsRef,where('WriterId','in',ids),orderBy('createdAt','desc'))
      onSnapshot(q2,(tweets)=>{
        const tweetsData=tweets.docs.map(doc=>({...doc.data(),id:doc.id}));
        console.log(tweetsData);
        setFollowingTweets(tweetsData);
      })
    })
  }

  useEffect(()=>{
    const unSubscribe=onAuthStateChanged(auth,(currentUser)=>{
      if(currentUser){
        getFollowing();
      }
    })
    return ()=>unSubscribe()
  },[])
  return (
    <div>
      {followingTweets.length==0&&<h1 className="text-lg font-bold text-center">no tweets from the people you follow</h1>}
      {followingTweets.map((tweet,index)=>(<Tweet key={index} tweetDetails={tweet}/>))}</div>
  )
}

export default Following