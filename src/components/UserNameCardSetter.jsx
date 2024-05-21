import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { collection,query,doc,updateDoc,getDocs,where } from "firebase/firestore";
import { db,auth } from "@/config/firebase";
import { useNavigate } from "react-router-dom";

const UserNameCardSetter = ({username}) => {
    const navigate=useNavigate();
    const addUsername=async ()=>{
         try {
           const usersRef = collection(db, "users");
           const q = query(
             usersRef,
             where("userId", "==", auth.currentUser.uid)
           );
           const querySnapshot = await getDocs(q);
           console.log(querySnapshot.docs[0].id);
           const docId = querySnapshot.docs[0].id;
           const userDoc = doc(db, "users", docId);
           const updateStatus = await updateDoc(userDoc, {
             username: username,
           });
           navigate('/home');
         } catch (error) {
           console.log(error);
         }
    }
  return (
    <>
      <Card className='mt-1'>
        <CardHeader>
          <CardTitle>Suggested Username</CardTitle>
          <CardDescription>The username you entered is unavailable</CardDescription>
        </CardHeader>
        <CardContent>
          <p>pick this username or try another one</p>
          <p className="text-xl font-bold">{username}</p>
        </CardContent>
        <CardFooter>
          <Button className='mr-1' onClick={addUsername}>
            accept
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default UserNameCardSetter;
