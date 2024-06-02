import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection,getDocs,where,query, addDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";
import { FaUserCircle } from "react-icons/fa";
import { Eye, Heart } from "lucide-react";
import { Repeat2 } from "lucide-react";
import { ThumbsDown } from "lucide-react";
import { doc,updateDoc} from "firebase/firestore";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { checkDate } from "./Dates";
import { MessageCircle } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

const Tweet = ({tweetDetails,ismyTweet,setErrorMessage}) => {
    const [disliked,setDisliked]=useState(false);
    const [liked, setLiked] = useState(false);
    const [retweeted, setRetweeted] = useState(false);
    const [tweetLikeRef,setTweetLikeRef]=useState([]);
    const [tweetDislikeRef, setTweetDislikeRef] = useState([]);
    const [tweetRetweetedRef, setTweetRetweetedRef] = useState([]);
    const navigate=useNavigate();

    const setInteractionsCorrect=async ()=>{
        const likesref=collection(db,'likes');
        const q=query(likesref,where('likerId','==',auth.currentUser.uid),where('tweetId','==',tweetDetails.id));
        const querySnapshot=await getDocs(q);
        if(querySnapshot.docs.length>0){
            setTweetLikeRef(querySnapshot.docs[0].ref);
            setLiked(true);
        }
        const dislikesref = collection(db, "dislikes");
        const q2 = query(
          dislikesref,
          where("dislikerId", "==", auth.currentUser.uid),
          where("tweetId", "==", tweetDetails.id)
        );
        const querySnapshot2 = await getDocs(q2);
        if (querySnapshot2.docs.length > 0) {
          setTweetDislikeRef(querySnapshot2.docs[0].ref);
          setDisliked(true);
        }
        const retweetsref = collection(db, "retweets");
        const q3 = query(
          retweetsref,
          where("retweeterId", "==", auth.currentUser.uid),
          where("tweetId", "==", tweetDetails.id)
        );
        const querySnapshot3 = await getDocs(q3);
        if (querySnapshot3.docs.length > 0) {
          setTweetRetweetedRef(querySnapshot3.docs[0].ref);
          setRetweeted(true);
        }
    }
    useEffect(() => {
      const unsub=onAuthStateChanged(auth,(currentUser)=>{
        if(currentUser){
          setInteractionsCorrect();

        }
      })
      return ()=>unsub();
     
    },[]); 
    

    const addRelationParameter=async(paramererName)=>{
        if (paramererName === "likes") {
          try {
            const likesref = collection(db, "likes");
            const docRef = await addDoc(likesref, {
              likerId: auth.currentUser.uid,
              tweetId: tweetDetails.id,
            });
            setTweetLikeRef(docRef);
          } catch (error) {
            console.log(error);
          }
        } else if (paramererName === "dislikes") {
          try {
            const likesref = collection(db, "dislikes");
            const docRef = await addDoc(likesref, {
              dislikerId: auth.currentUser.uid,
              tweetId: tweetDetails.id,
            });
            setTweetDislikeRef(docRef);
          } catch (error) {
            console.log(error);
          }
        } else if (paramererName === "retweets") {
          try {
            const likesref = collection(db, "retweets");
            const docRef = await addDoc(likesref, {
              retweeterId: auth.currentUser.uid,
              tweetId: tweetDetails.id,
            });
            setTweetRetweetedRef(docRef);
          } catch (error) {
            console.log(error);
          }
        }

    }
    const removeRelationParameter = async (paramererName) => {
      if (paramererName === "likes") {
        try {
          await deleteDoc(tweetLikeRef);
        } catch (error) {
          console.log(error);
        }
      } else if (paramererName === "dislikes") {
        try {
           await deleteDoc(tweetDislikeRef);
        } catch (error) {
          console.log(error);
        }
      } else if (paramererName === "retweets") {
        try {
         await deleteDoc(tweetRetweetedRef);
        } catch (error) {
          console.log(error);
        }
      }
    };
    const increaseTweetParameters=async (parameterType)=>{
        if(parameterType==='likes'){
            const userDoc = doc(db, "tweets", tweetDetails.id);
            await updateDoc(userDoc, {
            Likes:tweetDetails.Likes+1,
          });
          addRelationParameter(parameterType);
        }
        else if(parameterType==='dislikes'){
            const userDoc = doc(db, "tweets", tweetDetails.id);
            await updateDoc(userDoc, {
              Dislikes: tweetDetails.Dislikes + 1,
            });
            addRelationParameter(parameterType);
        }
        else if(parameterType==='retweets'){
             const userDoc = doc(db, "tweets", tweetDetails.id);
             await updateDoc(userDoc, {
               Retweets: tweetDetails.Retweets + 1,
             });
             addRelationParameter(parameterType);
        }


    }
    const decreaseTweetParameters = async (parameterType) => {
      if (parameterType === "likes") {
        const userDoc = doc(db, "tweets", tweetDetails.id);
        await updateDoc(userDoc, {
          Likes: tweetDetails.Likes - 1,
        });
        removeRelationParameter(parameterType);
      } else if (parameterType === "dislikes") {
        const userDoc = doc(db, "tweets", tweetDetails.id);
        await updateDoc(userDoc, {
          Dislikes: tweetDetails.Dislikes - 1,
        });
        removeRelationParameter(parameterType);
      } else if (parameterType === "retweets") {
        const userDoc = doc(db, "tweets", tweetDetails.id);
        await updateDoc(userDoc, {
          Retweets: tweetDetails.Retweets - 1,
        });
        removeRelationParameter(parameterType);
      }
    };
  return (
    <div
      className="mb-2"
      onClick={() => {
        navigate(`/home/${tweetDetails.id}`);
      }}
    >
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Avatar>
              <AvatarImage src={tweetDetails.tweeterImageUrl} />
              <AvatarFallback>
                <FaUserCircle />
              </AvatarFallback>
            </Avatar>
            @
            <Button variant="link" asChild className="px-0 text-lg">
              <Link to="/home/user" state={{ userId: tweetDetails.WriterId }}>
                {ismyTweet ? "me" : tweetDetails.tweeterUsername}
              </Link>
            </Button>
          </CardTitle>
          <CardDescription>{checkDate(tweetDetails.createdAt)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-start">{tweetDetails.TweetContent}</p>
        </CardContent>
        <CardFooter>
          <span
            className="flex mr-2"
            onClick={(event) => {
              event.stopPropagation();
              if (liked && !disliked) {
                setLiked(false);
                decreaseTweetParameters("likes")
                  .then(() => {})
                  .catch((error) => {
                    const errorMessage = `There was a problem with unliking.Try again later.${error.message}`;
                    setErrorMessage(errorMessage);
                    console.error(error);
                    setLiked(true);
                  });
              } else if (!liked && !disliked) {
                setLiked(true);
                increaseTweetParameters("likes")
                  .then(() => {})
                  .catch((error) => {
                    const errorMessage = `There was a problem with liking.Try again later.${error.message}`;
                    console.error(error);
                    setErrorMessage(errorMessage);
                    setLiked(false);
                  });
              } else if (!liked && disliked) {
                setDisliked(false);
                setLiked(true);
                increaseTweetParameters("likes")
                  .then(() => {
                    decreaseTweetParameters("dislikes")
                      .then(() => {})
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    const errorMessage = `There was a problem with liking.Try again later.${error.message}`;
                    setErrorMessage(errorMessage);
                    setLiked(false);
                    setDisliked(true);
                  });
              }
            }}
          >
            <Heart
              fill={liked ? "red" : "white"}
              color={liked ? "red" : "black"}
            />
            {tweetDetails.Likes}
          </span>
          <span
            className="flex mr-2"
            onClick={(event) => {
              event.stopPropagation();
              if (disliked && !liked) {
                setDisliked(false);
                decreaseTweetParameters("dislikes")
                  .then(() => {})
                  .catch((error) => {
                    const errorMessage = `There was a problem with undisliking.Try again later.${error.message}`;
                    setErrorMessage(errorMessage);
                    setDisliked(true);
                  });
              } else if (!disliked && !liked) {
                setDisliked(true);
                increaseTweetParameters("dislikes")
                  .then(() => {})
                  .catch((error) => {
                    const errorMessage = `There was a problem with disliking.Try again later.${error.message}`;
                    setErrorMessage(errorMessage);
                    setDisliked(false);
                  });
              } else if (!disliked && liked) {
                setLiked(false);
                setDisliked(true);
                increaseTweetParameters("dislikes")
                  .then(() => {
                    decreaseTweetParameters("likes")
                      .then(() => {})
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    const errorMessage = `There was a problem with disliking.Try again later.${error.message}`;
                    setErrorMessage(errorMessage);
                    setDisliked(false);
                    setLiked(true);
                  });
              }
            }}
          >
            <ThumbsDown
              fill={disliked ? "black" : "white"}
              color={disliked ? "blue" : "black"}
            />
            {tweetDetails.Dislikes}
          </span>
          <span
            className="flex mr-2"
            onClick={(event) => {
              event.stopPropagation();
              if (retweeted) {
                setRetweeted(false);
                decreaseTweetParameters("retweets")
                  .then(() => {})
                  .catch((error) => {
                    const errorMessage = `There was a problem with unretweeting.Try again later.${error.message}`;
                    setErrorMessage(errorMessage);
                    setRetweeted(true);
                  });
              } else {
                setRetweeted(true);
                increaseTweetParameters("retweets")
                  .then(() => {})
                  .catch((error) => {
                    const errorMessage = `There was a problem with retweeeting.Try again later.${error.message}`;
                    setErrorMessage(errorMessage);
                    setRetweeted(false);
                  });
              }
            }}
          >
            <Repeat2 color={retweeted ? "green" : "black"} />
            {tweetDetails.Retweets}
          </span>
          <span className="flex mr-2">
            <Eye />
            {tweetDetails.Impressions}
          </span>
          <span className="flex mr-2">
            <MessageCircle />
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Tweet;
