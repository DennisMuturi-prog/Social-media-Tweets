import  { useEffect, useState } from 'react'
import { collection,where,onSnapshot,orderBy,query,getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Tweet from './Tweet';

const ThreadedTweets = ({parentTweet}) => {
    const [errorMessage,setErrorMessage]=useState('');
    const [threadedTweets,setThreadedTweets]=useState([]);
    const getThreadTweets = async () => {
      const q = query(
        collection(db, "tweets"),
        where("parentTweetId", "==", parentTweet.id),
        orderBy("createdAt", "asc")
      );
     const unsubTweets = onSnapshot(
       q,
       (querySnapshot) => {
         querySnapshot.docChanges().forEach((change) => {
           if (change.type === "added") {
            console.log('added:',change.doc.data())
             setThreadedTweets((currentTweets) => [
               { ...change.doc.data(), id: change.doc.id },
               ...currentTweets
             ]);
           } else if (change.type === "modified") {
             setThreadedTweets((prevTweets) => {
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
        getThreadTweets().then((unsubTweets)=>{
            console.log(unsubTweets);
             return () => {
               unsubTweets();
             };
        });
       
     },[parentTweet.id])
  return (
    <div>
      {" "}
      {threadedTweets.length == 0 && (
        <h1 className="text-lg">no replies yet...</h1>
      )}
      {threadedTweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          tweetDetails={tweet}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </div>
  );
}

export default ThreadedTweets