import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { generateUniqueUsername } from "./usernameGenerator";
import { auth, db } from "@/config/firebase";
import UserNameCardSetter from "./UserNameCardSetter";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import AlertUsername from "./AlertUsername";
import { AlertDestructive } from "./AlertDestructive";

const formSchema = yup.object({
  username: yup.string().required(),
});
const UsernameSetter = ({destination}) => {
  const [loading,setLoading]=useState(false);
  const [errorMessage,setErrorMessage]=useState('');
  const [successUpdate,setSuccessUpdate]=useState(false);
  const navigate = useNavigate();
  const [uniqueUsername, setUniqueUsername] = useState("");
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  const onSubmit = (data) => {
    setLoading(true);
    generateUniqueUsername(data.username).then(async (result) => {
      if (result == data.username) {
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
          updateDoc(userDoc, {
            username: data.username,
          }).then(()=>{
            setLoading(false);
            setSuccessUpdate(true);
            navigate(destination);
          });
        } catch (error) {
          const errorStatus=`Failed updating username${error.message}`
          setErrorMessage(errorStatus);
        }
      } else {
        setUniqueUsername(result);
        setLoading(false);
      }
    });
  };
  return (
    <>
    {successUpdate&&<AlertUsername/>}
    {errorMessage&&<AlertDestructive errorMessage={errorMessage}/>}
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-bold mb-2">Enter username</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-1/2 md:w-1/3"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="unique username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loading && <Spinner></Spinner>}
            <Button className="w-full mt-2" type="submit" disabled={loading}>
              {loading ? "Loading" : "Next"}
            </Button>
          </form>
        </Form>
        {uniqueUsername && <UserNameCardSetter username={uniqueUsername} />}
      </div>
    </>
  );
};

export default UsernameSetter;
