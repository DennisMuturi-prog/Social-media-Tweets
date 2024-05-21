import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection,getDocs,where,query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { FaUserCircle } from "react-icons/fa";
import { Eye, Heart } from "lucide-react";
import { Repeat2 } from "lucide-react";
import { ThumbsDown } from "lucide-react";


const Tweet = ({tweetDetails}) => {
    const [imageUrl,setImageUrl]=useState('');
    const [username,setUsername]=useState('');
    const getUserDetails=()=>{
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", tweetDetails.WriterId));
        getDocs(q).then((querySnapshot) => {
          const userDetails = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setImageUrl(userDetails[0].profilePicUrl);
          setUsername(userDetails[0].username);
        });

    }
    useEffect(()=>{
        getUserDetails();
    },[])
  return (
    <div>
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Avatar>
              <AvatarImage src={imageUrl} />
              <AvatarFallback>
                <FaUserCircle />
              </AvatarFallback>
            </Avatar>
            <span>@{username}</span>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-start">{tweetDetails.TweetContent}</p>
        </CardContent>
        <CardFooter>
          <span className="flex mr-2">
            <Heart />
            {tweetDetails.Likes}
          </span>
          <span className="flex mr-2">
            <ThumbsDown />
            {tweetDetails.Dislikes}
          </span>
          <span className="flex mr-2">
            <Repeat2 />
            {tweetDetails.Retweets}
          </span>
          <span className="flex mr-2">
            <Eye />
            {tweetDetails.Impressions}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Tweet;
