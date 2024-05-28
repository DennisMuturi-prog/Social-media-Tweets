import { db } from '@/config/firebase';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import Tweet from './Tweet';
import { AlertDestructive } from './AlertDestructive';
import { ReplyTweet } from './ReplyTweet';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

const Thread = () => {
    const {state}=useLocation();
    const navigate=useNavigate();
    const [errorMessage,setErrorMessage]=useState('');
    const [threadedTweets,setThreadedTweets]=useState([]);
    const [parentTweet,setParentTweet]=useState('');
    const getThreadTweets=()=>{
        const q=query(collection(db,'tweets'),where('parentTweetId','==',state.tweetDetails.id));
        onSnapshot(q,(querySnapshot)=>{
            const threadTweets=querySnapshot.docs.map((doc)=>
            ({...doc.data(),id:doc.id}));
            setThreadedTweets(threadTweets);
            console.log(threadedTweets);
        })

    }
    useEffect(()=>{
        getParentTweet();
        getThreadTweets();
    },[]);
    const getParentTweet=()=>{
        const docRef=doc(db,'tweets',state.tweetDetails.id);
        onSnapshot(docRef,(result)=>{
             const parentTweetDetails = { ...result.data(), id: result.id };
             console.log(parentTweetDetails);
             setParentTweet(parentTweetDetails);
        })
    }
  return (
    <div>
      <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-lg font-bold text-center">Thread</h1>
      </div>
      {errorMessage && <AlertDestructive errorMessage={errorMessage} />}
      {parentTweet && (
        <Tweet tweetDetails={parentTweet} setErrorMessage={setErrorMessage} />
      )}
      <ReplyTweet parentTweetId={state.tweetDetails.id} />
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

export default Thread