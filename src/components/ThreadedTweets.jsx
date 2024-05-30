import  { useEffect, useState } from 'react'
import { collection,where,onSnapshot,orderBy,query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Tweet from './Tweet';

const ThreadedTweets = ({parentTweet}) => {
    const [errorMessage,setErrorMessage]=useState('');
    const [threadedTweets,setThreadedTweets]=useState([]);
     const getThreadTweets = () => {
       setThreadedTweets([]);
       const q = query(
         collection(db, "tweets"),
         where("parentTweetId", "==", parentTweet.id),
         orderBy("createdAt", "desc")
       );
       onSnapshot(q, (querySnapshot) => {
         const threadTweets = querySnapshot.docs.map((doc) => ({
           ...doc.data(),
           id: doc.id,
         }));
         setThreadedTweets(threadTweets);
       });
     };
     useEffect(()=>{
        getThreadTweets();
     },[parentTweet.id])
  return (
    <div>
      {" "}
      {threadedTweets.length == 0 && (
        <h1 className="text-lg">no replies yet...</h1>
      )}
      {threadedTweets.map((tweet, index) => (
        <Tweet
          key={index}
          tweetDetails={tweet}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </div>
  );
}

export default ThreadedTweets