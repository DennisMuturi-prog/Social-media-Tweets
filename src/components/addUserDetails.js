import { auth ,db} from "@/config/firebase";
import { addDoc,collection } from "firebase/firestore";
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