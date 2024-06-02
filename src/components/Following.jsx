import { auth,db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, where,getDocs } from "firebase/firestore";
import { useEffect, useState } from "react"
import Tweet from "./Tweet";
import { setInteractionsCorrect } from "./Interactions";

const Following = () => {
  const [followingTweets,setFollowingTweets]=useState([]);
  const [followingIds,setFollowingIds]=useState([]);
  const getFollowing=()=>{
    const followsRef=collection(db,'follows');
    const q=query(followsRef,where('followerId','==',auth.currentUser.uid));
    getDocs(q).then((querySnapshot) => {
      const ids = querySnapshot.docs.map((doc) => doc.data().followedId);
      setFollowingIds(ids);
      updateFollowingTweets(ids).then((unsubFollowingTweets)=>{
        return unsubFollowingTweets;
      });
    });
  }
  const updateFollowing=()=>{
     const followsRef = collection(db, "follows");
     const q = query(
       followsRef,
       where("followerId", "==", auth.currentUser.uid)
     );
    const unsubFollowing = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setFollowingIds([...followingIds, change.doc.data().followedId]);
        }
      });
    });
  }
  const updateFollowingTweets=async (ids)=>{
    const tweetsRef = collection(db, "tweets");
    const q = query(
      tweetsRef,
      where("WriterId", "in", ids),
      orderBy("createdAt", "asc")
    );
     const unsubFollowingTweets = onSnapshot(q, (querySnapshot) => {
       querySnapshot.docChanges().forEach((change) => {
         if (change.type === "added") {
            setFollowingTweets((currentTweets) => [
              { ...change.doc.data(), id: change.doc.id },
              ...currentTweets
            ]);
         } else if (change.type === "modified") {
           setFollowingTweets((prevTweets) => {
             return prevTweets.map((tweet) =>
               tweet.id === change.doc.id
                 ? { ...change.doc.data(), id: change.doc.id }
                 : tweet
             );
           });
         }
       });
     });
     return unsubFollowingTweets;

  }
 

  useEffect(()=>{
    const unSubscribe=onAuthStateChanged(auth,(currentUser)=>{
      if(currentUser){
        getFollowing().then((unsubFollowingTweets)=>{
          return ()=>{
            unsubFollowingTweets();
            unSubscribe();
          }
        });
      }
    })
    return ()=>{
      unSubscribe()
    }
  },[])
  return (
    <div>
      {followingTweets.length==0&&<h1 className="text-lg font-bold text-center">no tweets from the people you follow</h1>}
      {followingTweets.map((tweet)=>(<Tweet key={tweet.id} tweetDetails={tweet}/>))}</div>
  )
}

export default Following