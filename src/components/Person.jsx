import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "./ui/button";
import { auth, db } from "@/config/firebase";
import {
  collection,
  updateDoc,
  doc,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const Person = ({ userDetails, myUserDetails ,setErrorMessage}) => {
  const [following, setFollowing] = useState(false);
  const [currentFollowRef,setCurrentFollowRef]=useState({});
  const followUser = async () => {
    try {
      const userRef = doc(db, "users", userDetails.id);
      await updateDoc(userRef, {
        followersCount: userDetails.followersCount + 1,
      });
      console.log(myUserDetails);
      const myuserRef = doc(db, "users", myUserDetails.id);
      await updateDoc(myuserRef, {
        followingCount: myUserDetails.followingCount + 1,
      });
    } catch (error) {
      console.log(error);
    }
    try {
      const followsRef = collection(db, "follows");
      const docRef=await addDoc(followsRef, {
        followedId: userDetails.userId,
        followerId: auth.currentUser.uid,
      });
      setCurrentFollowRef(docRef);
    } catch (error) {
      console.log(error);
    }
  };
  const unfollowUser = async () => {
    try {
      const userRef = doc(db, "users", userDetails.id);
      await updateDoc(userRef, {
        followersCount: userDetails.followersCount - 1,
      });
      console.log(myUserDetails);
      const myuserRef = doc(db, "users", myUserDetails.id);
      await updateDoc(myuserRef, {
        followingCount: myUserDetails.followingCount - 1,
      });
    } catch (error) {
      console.log(error);
    }
    try {
      await deleteDoc(currentFollowRef);
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfFollowing = async () => {
    try {
      const followsRef = collection(db, "follows");
      const q = query(
        followsRef,
        where("followedId", "==", userDetails.userId),
        where("followerId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        setCurrentFollowRef(querySnapshot.docs[0].ref);
        setFollowing(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
   useEffect(() => {
     checkIfFollowing();
   }, []);
  return (
    <div className="flex mb-3">
      <Card className=" flex justify-start items-center w-72">
        <Avatar>
          <AvatarImage src={userDetails.profilePicUrl} />
          <AvatarFallback>
            <FaUserCircle />
          </AvatarFallback>
        </Avatar>
        <span>@{userDetails.username}</span>
        <div className="flex flex-col ml-auto">
          <span className="mr-1 f">
            {userDetails.followersCount} {' '}followers
          </span>
          <span className="mr-1 ">
            {userDetails.followingCount}{' '}following
          </span>
        </div>
      </Card>
      <Button
      className={following?'bg-gray-600':''}
        onClick={() => {
            if(!following){
                setFollowing(true);
                followUser().then((result) => {
                    console.log(result);
                }).catch((error)=>{
                    const errorMessage = `There was a problem with following.Try again later.${error.message}`;
                    setErrorMessage(errorMessage);
                    setFollowing(false);
                });
            }
            else{
                setFollowing(false);
                unfollowUser().then((result) => {
                    console.log(result);
                  
                }).catch((error)=>{
                    console.log(error);
                    const errorMessage=`There was a problem with unfollowing.Try again later.${error.message}`;
                    setErrorMessage(errorMessage);
                    setFollowing(true);
                });
            }
          
        }}
      >
        {following ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default Person;
