import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const User = () => {
    const [imageUrl,setImageUrl]=useState('');
    const [username,setUsername]=useState('');
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("userId", "==", currentUser.uid));
            getDocs(q).then((querySnapshot) => {
              const userDetails = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
              setImageUrl(userDetails[0].profilePicUrl);
              setUsername(userDetails[0].username);
            });
          }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    },[])
  return (
    <div className="flex justify-end">
      <Card className=" flex justify-center items-center w-fit">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            <FaUserCircle />
          </AvatarFallback>
        </Avatar>
        @{username}
      </Card>
    </div>
  );
};

export default User;
