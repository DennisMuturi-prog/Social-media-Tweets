import {
  collection,
  where,
  query,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "./ui/button";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";
import MyTweets from "./MyTweets";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({});
  const {state}=useLocation();
  console.log(state);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", state.userId));
        onSnapshot(q, (querySnapshot) => {
          const userdetails = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
          }));
          setUserDetails(userdetails[0]);
        });
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div>
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
          <span className="font-medium mr-2 text-xl">
            {userDetails.followersCount} Followers
          </span>
          <span className="font-medium text-xl">
            {userDetails.followingCount} Following
          </span>
        </CardContent>
      </Card>
      <MyTweets userId={state.userId}/>
    </div>
  );
};

export default UserProfile;
