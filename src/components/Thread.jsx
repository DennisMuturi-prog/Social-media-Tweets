import {db } from "@/config/firebase";
import {
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tweet from "./Tweet";
import { AlertDestructive } from "./AlertDestructive";
import { ReplyTweet } from "./ReplyTweet";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import ThreadedTweets from "./ThreadedTweets";
import { setInteractionsCorrect } from "./Interactions";

const Thread = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [parentTweet, setParentTweet] = useState("");

  useEffect(() => {
    getParentTweet();
  }, []);

  useEffect(() => {
    getParentTweet();
  }, [id]);
  const getParentTweet = () => {
    const docRef = doc(db, "tweets", id);
    getDoc(docRef).then((result) => {
      setInteractionsCorrect(result.id).then((interactionData)=>{
         console.log(interactionData);
         const parentTweetDetails = {
           ...result.data(),
           ...interactionData,
           id: result.id,
         };
         console.log(parentTweetDetails)
         setParentTweet(parentTweetDetails);
      });
     
    });
    onSnapshot(docRef, (querySnapshot) => {
         const newState = querySnapshot.data();
         const changes = {};
         for (const [key, value] of Object.entries(newState)) {
           if (parentTweet[key] !== value) {
             changes[key] = value;
           }
         }

         setParentTweet((prevState) => ({ ...prevState, ...changes }));

    });
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
        <Tweet tweetDetails={parentTweet} setErrorMessage={setErrorMessage} />
      )}
      <ReplyTweet parentTweetId={id} />
      {parentTweet && <ThreadedTweets parentTweet={parentTweet} />}
    </div>
  );
};

export default Thread;
