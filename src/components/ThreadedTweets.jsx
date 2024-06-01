import  { useEffect, useState } from 'react'
import { collection,where,onSnapshot,orderBy,query,getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Tweet from './Tweet';
import { setInteractionsCorrect } from './Interactions';

const ThreadedTweets = ({parentTweet}) => {
    const [errorMessage,setErrorMessage]=useState('');
    const [threadedTweets,setThreadedTweets]=useState([]);
     const getTweets = () => {
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
      const getThreadTweets = async () => {
       const q = query(
         collection(db, "tweets"),
         where("parentTweetId", "==", parentTweet.id),
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

        setThreadedTweets(tweetsData);
       const q2 = query(
         collection(db, "tweets"),
         where("parentTweetId", "==", parentTweet.id),
       );
        onSnapshot(q2, (querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added" || change.type === "modified") {
              setThreadedTweets((prevTweets) => {
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
        getThreadTweets();
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