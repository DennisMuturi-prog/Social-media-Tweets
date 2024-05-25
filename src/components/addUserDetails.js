import { auth ,db} from "@/config/firebase";
import { addDoc,collection, doc, getDocFromServer, getDocs, query, updateDoc, where } from "firebase/firestore";
export const addUserDetails = async (profilepicUrl) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        followersCount: 0,
        followingCount: 0,
        userId: auth.currentUser.uid,
        profilePicUrl:profilepicUrl
      });
    } catch (error) {
      console.log(error);
    }
  };
  export const updateUserDetails=async(imageUrl)=>{
    const usersRef=collection(db,'users');
    const q=query(usersRef,where('userId','==',auth.currentUser.uid));
    const querySnapshot=await getDocs(q);
    const idDoc=querySnapshot.docs[0].id;
    const docRef=doc(db,'users',idDoc);
    await updateDoc(docRef,{
      profilePicUrl:imageUrl
    })
  }