import { collection,where,query,onSnapshot } from "firebase/firestore";
import { db,auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Person from "./Person";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const FollowersAndFollowing = () => {
  const {state}=useLocation();
  const [usersDetails,setUserDetails]=useState([]);
  const [myUserDetails,setMyUserDetails]=useState({});
  const navigate=useNavigate();
  console.log(state);
   const getFollowing = () => {
     const followsRef = collection(db, "follows");
     const q = query(
       followsRef,
       where("followerId", "==", state.userId?state.userId:auth.currentUser.uid)
     );
     onSnapshot(q, (querySnapshot) => {
       const ids = querySnapshot.docs.map((doc) => doc.data().followedId);
       console.log(ids);
       const usersRef = collection(db, "users");
       const q2 = query(usersRef, where("userId", "in", ids));
       onSnapshot(q2, (userDetails) => {
         const usersData = userDetails.docs.map((doc) => ({
           ...doc.data(),
           id: doc.id,
         }));
         console.log(usersData);
         setUserDetails(usersData);
       });
     });
   };
   const getFollowers = () => {
     const followsRef = collection(db, "follows");
     const q = query(
       followsRef,
       where("followedId", "==", state.userId?state.userId:auth.currentUser.uid)
     );
     onSnapshot(q, (querySnapshot) => {
       const ids = querySnapshot.docs.map((doc) => doc.data().followerId);
       console.log(ids);
       const usersRef = collection(db, "users");
       const q2 = query(usersRef, where("userId", "in", ids));
       onSnapshot(q2, (userDetails) => {
         const usersData = userDetails.docs.map((doc) => ({
           ...doc.data(),
           id: doc.id,
         }));
         console.log(usersData);
         setUserDetails(usersData);
       });
     });
   };
   const getMyDetails= ()=>{
    const q=query(collection(db,'users'),where('userId','==',auth.currentUser.uid));
    onSnapshot(q,(querySnapshot)=>{
      const myData=querySnapshot.docs.map(doc=>({...doc.data(),id:doc.id}));
      setMyUserDetails(myData[0]);
    })
   }
   useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,(currentUser)=>{
      if(currentUser){
        if(state.isFollowers){
          getFollowers();
        }
        else{
          getFollowing();
        }
        getMyDetails();
      }
    })
    return ()=>unsubscribe();
   },[])

  return (
    <div>
      <Button variant='outline' onClick={()=>{
        navigate(-1);
      }}>
        <ArrowLeft />
      </Button>
      {state.isFollowers ? (
        <h1 className="font-bold text-lg">
          {" "}
          {state.userId ? `${state.username} ` : "My "}Followers
        </h1>
      ) : (
        <h1 className="font-bold text-lg">
          {state.userId ? `${state.username} ` : "My "}Following
        </h1>
      )}
      {usersDetails.map((userDetails, index) => (
        <Person
          key={index}
          userDetails={userDetails}
          myUserDetails={myUserDetails}
        />
      ))}
    </div>
  );
}

export default FollowersAndFollowing