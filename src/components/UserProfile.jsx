import {
  collection,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "./ui/button";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import MyTweets from "./MyTweets";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({});
  const {state}=useLocation();
  const navigate=useNavigate();
  console.log(state);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", state.userId));
        const unsubUserProfile=onSnapshot(q, (querySnapshot) => {
          const userdetails = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
          }));
          setUserDetails(userdetails[0]);
          return ()=>{
            unsubUserProfile();
            unsubscribe();
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div>
      <div className="flex">
        <Button variant='outline' onClick={()=>{
          navigate(-1);
        }}>
          <ArrowLeft />
        </Button>
        <Card className=" flex justify-center items-center w-fit">
          <Avatar>
            <AvatarImage src={userDetails.profilePicUrl} />
            <AvatarFallback>
              <FaUserCircle />
            </AvatarFallback>
          </Avatar>
          @{userDetails.username}
        </Card>
      </div>
        <h1 className="text-lg font-bold text-center">
          {`${userDetails.username}`} profile
        </h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex">
            <Avatar>
              <AvatarImage src={userDetails.profilePicUrl} />
              <AvatarFallback>
                <FaUserCircle />
              </AvatarFallback>
            </Avatar>
            <span className="">@{userDetails.username}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="link" asChild className="text-lg">
            <Link
              to="/home/followersAndFollowing"
              state={{
                isFollowers: true,
                userId: userDetails.userId,
                username: userDetails.username,
              }}
            >
              {userDetails.followersCount} Followers
            </Link>
          </Button>
          <Button variant="link" asChild className="text-lg">
            <Link
              to="/home/followersAndFollowing"
              state={{
                isFollowers: false,
                userId: userDetails.userId,
                username: userDetails.username,
              }}
            >
              {userDetails.followingCount} Following
            </Link>
          </Button>
        </CardContent>
      </Card>
      <h1 className="text-lg font-bold text-center">
        {`${userDetails.username}'s `}Tweets
      </h1>
      <MyTweets userId={state.userId} />
    </div>
  );
};

export default UserProfile;
