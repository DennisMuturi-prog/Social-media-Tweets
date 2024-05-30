import { db } from '@/config/firebase';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import Tweet from './Tweet';
import { AlertDestructive } from './AlertDestructive';
import { ReplyTweet } from './ReplyTweet';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import ThreadedTweets from './ThreadedTweets';

const Thread = () => {
    const navigate=useNavigate();
    const {id}=useParams();
    const [errorMessage,setErrorMessage]=useState('');
    const [parentTweet,setParentTweet]=useState('');
   
    useEffect(()=>{
        setParentTweet('');
        getParentTweet();
    },[id]);
    const getParentTweet=()=>{
        const docRef=doc(db,'tweets',id);
        onSnapshot(docRef,(result)=>{
             const parentTweetDetails = { ...result.data(), id: result.id };
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
        <Tweet tweetDetails={parentTweet} setErrorMessage={setErrorMessage}  />
      )}
      <ReplyTweet parentTweetId={id} />
      {parentTweet&&<ThreadedTweets parentTweet={parentTweet}/>}
    </div>
  );
}

export default Thread