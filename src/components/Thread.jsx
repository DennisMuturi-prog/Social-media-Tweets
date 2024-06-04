import {db } from "@/config/firebase";
import {
    collection,
  doc,
  orderBy,
  onSnapshot,
  where,
  query
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tweet from "./Tweet";
import { AlertDestructive } from "./AlertDestructive";
import { ReplyTweet } from "./ReplyTweet";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const Thread = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [parentTweet, setParentTweet] = useState('');
  const [threadedTweets, setThreadedTweets] = useState([]);

  const getThreadTweets = async () => {
    const q = query(
      collection(db, "tweets"),
      where("parentTweetId", "==",id),
      orderBy("createdAt", "desc")
    );
    const unsubTweets = onSnapshot(
      q,
      (querySnapshot) => {
        const tweetsData=querySnapshot.docs.map((doc)=>({...doc.data(),id:doc.id}));
        setThreadedTweets(tweetsData)  
      },
      (error) => {
        console.error(error);
        setErrorMessage(error.message);
      }
    );
    return unsubTweets;
  };

  useEffect(() => {
    setThreadedTweets([])
    getParentTweet().then((unsubParent)=>{
        getThreadTweets().then((unsubTweets)=>{
             return () =>{
                unsubParent();
                unsubTweets()
             } 
        })
    });
  }, [id]);
  const getParentTweet = async() => {
    const docRef = doc(db, "tweets", id);
    const unsubParent=onSnapshot(
      docRef,
      (doc) => {
        setParentTweet({ ...doc.data(), id: doc.id });
      },
      (error) => {
        console.error(error);
        setErrorMessage(error.message);
      }
    ); 
    return unsubParent;
  };
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
        <Tweet
          key={parentTweet.id}
          tweetDetails={parentTweet}
          setErrorMessage={setErrorMessage}
        />
      )}
      <ReplyTweet parentTweetId={id} />
      {threadedTweets.length == 0 && (
        <h1 className="text-lg">no replies yet...</h1>
      )}
      {parentTweet &&
        threadedTweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetDetails={tweet}
            setErrorMessage={setErrorMessage}
          />
        ))}
    </div>
  );
};

export default Thread;
