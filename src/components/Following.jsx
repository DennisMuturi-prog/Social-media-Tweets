import { auth,db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, where,getDocs } from "firebase/firestore";
import { useEffect, useState } from "react"
import Tweet from "./Tweet";
import { setInteractionsCorrect } from "./Interactions";

const Following = () => {
  const [followingTweets,setFollowingTweets]=useState([]);
  const getFollowing=()=>{
    const followsRef=collection(db,'follows');
    const q=query(followsRef,where('followerId','==',auth.currentUser.uid));
    onSnapshot(q,(querySnapshot)=>{
      const ids=querySnapshot.docs.map((doc)=>(doc.data().followedId));
      getTweets(ids);
    })
  }
   const getTweets = async (ids) => {
     const tweetsRef = collection(db, "tweets");
     const q = query(
       tweetsRef,
       where("WriterId", "in", ids),
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

     setFollowingTweets(tweetsData);
     const q2 = query(
       tweetsRef,
       where("WriterId", "in", ids),
     );
     onSnapshot(q2, (querySnapshot) => {
       querySnapshot.docChanges().forEach((change) => {
         if (change.type === "added" || change.type === "modified") {
           setFollowingTweets((prevTweets) => {
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