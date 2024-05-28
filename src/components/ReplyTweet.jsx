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
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { AlertDestructive } from "./AlertDestructive";
import { Input } from "./ui/input";

const FormSchema = yup.object({
  tweet: yup
    .string()
    .min(10, "tweet  must be at least 10 characters.")
    .max(160, "tweet must not be longer than 30 characters.")
    .required(),
});

export function ReplyTweet({parentTweetId}) {
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
        parentTweetId: parentTweetId,
      });
      console.log("Document written with ID: ", docRef.id);
      form.reset({ tweet: "" });
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex">
          <FormField
            control={form.control}
            name="tweet"
            render={({ field }) => (
              <FormItem className="flex-grow mr-1">
                <FormControl>
                  <Input placeholder="Reply away..." autoComplete='off' {...field}  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="" type="submit">
            <IoSendSharp />
          </Button>
        </form>
      </Form>
      {errorMessage && <AlertDestructive errorMessage={errorMessage} />}
    </>
  );
}
