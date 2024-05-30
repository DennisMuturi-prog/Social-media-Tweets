import { IoSendSharp } from "react-icons/io5";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, db } from "../config/firebase";
import { collection, addDoc,getDocs,where,query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AlertDestructive } from "./AlertDestructive";
import { onAuthStateChanged } from "firebase/auth";



export function CreateTweet() {
  const FormSchema = yup.object({
    tweet: yup
      .string()
      .min(10, "tweet  must be at least 10 characters.")
      .max(160, "tweet must not be longer than 30 characters.")
      .required(),
  });
  const [imageUrl,setImageUrl]=useState('');
  const [username,setUsername]=useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm({
    resolver: yupResolver(FormSchema),
  });

  async function onSubmit(data) {
    const { tweet } = data;
    const userId = auth.currentUser.uid;
    try {
      const docRef = await addDoc(collection(db, "tweets"), {
        Dislikes: 0,
        Likes: 0,
        Impressions: 0,
        Retweets: 0,
        TweetContent: tweet,
        WriterId: userId,
        createdAt: new Date(),
        parentTweetId:false,
        tweeterUsername:username,
        tweeterImageUrl:imageUrl
      });
      console.log("Document written with ID: ", docRef.id);
      form.reset({tweet:''});
    } catch (error) {
      setErrorMessage(error.message)
    }
  }
   const getUserDetails = () => {
     const usersRef = collection(db, "users");
     const q = query(usersRef, where("userId", "==", auth.currentUser.uid));
     getDocs(q).then((querySnapshot) => {
       const userDetails = querySnapshot.docs.map((doc) => ({
         ...doc.data(),
         id: doc.id,
       }));
       setImageUrl(userDetails[0].profilePicUrl);
       setUsername(userDetails[0].username);
     });
   };
   useEffect(() => {
     const unsub = onAuthStateChanged(auth, (currentUser) => {
       if (currentUser) {
         getUserDetails();
       }
     });
     return () => unsub();
   }, []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="tweet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tweet</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tweet away"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-1/2" type="submit">
            <IoSendSharp />
          </Button>
        </form>
      </Form>
      {errorMessage&&<AlertDestructive  errorMessage={errorMessage}/>}
    </>
  );
}
