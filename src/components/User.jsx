import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, db } from "@/config/firebase";
import { QuerySnapshot, collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import {
  Card
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const User = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", currentUser.uid));
        const unsub=onSnapshot(q,(querySnapshot)=>{
          const userDetails = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setImageUrl(userDetails[0].profilePicUrl);
          setUsername(userDetails[0].username);
        })
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("user signed out");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="flex justify-end">
      <HoverCard>
        <HoverCardTrigger>
          <Card className=" flex justify-center items-center w-fit">
            <Avatar>
              <AvatarImage src={imageUrl} />
              <AvatarFallback>
                <FaUserCircle />
              </AvatarFallback>
            </Avatar>
            @{username}
          </Card>
        </HoverCardTrigger>
        <HoverCardContent>
          <Button onClick={logOut}>Logout</Button>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default User;
