import { collection, where, query, getDocs, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "./ui/button";
import ChangeUsername from "./ChangeUsername";
import { onAuthStateChanged } from "firebase/auth";
import ChangeProfilePic from "./ChangeProfilePic";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", auth.currentUser.uid));
        onSnapshot(q,(querySnapshot)=>{
          const userdetails = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
          }));
          setUserDetails(userdetails[0]);

        })
      }
    });
    return ()=>unsubscribe();
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
      <h1 className="font-medium text-lg text-center">Settings</h1>
      <div className="flex flex-col gap-2 justify-center items-center">
        <ChangeUsername />
        <ChangeProfilePic/>
        <Button>Change Password</Button>
        <Button>Log out</Button>
      </div>
    </div>
  );
};

export default Profile;
