import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
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
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/config/firebase";
import { useState } from "react";
import Spinner from "./Spinner";
import { AlertDestructive } from "./AlertDestructive";

const formSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
const Login = () => {
  const [errorMessage,setErrorMessage]=useState('');
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data) => {
    setLoading(true);
    const {email,password}=data;
    console.log(data);
    signInWithEmailAndPassword(auth,email,password).then((result)=>{
      console.log(result);
      navigate('/home/explore');
    }).catch((error)=>{
      setErrorMessage(error.message);
      setLoading(false);
    })
  };
  const signInWithGoogle=()=>{
    signInWithPopup(auth,provider).then((result)=>{
      console.log(result);
      navigate('/home/explore');
    }).catch((error)=>{
      setErrorMessage(error.message);
    })

  }
  return (
    <div className="flex flex-col justify-center items-center shadow">
      <h1 className="font-bold mb-2">Login</h1>
      {errorMessage&&<AlertDestructive errorMessage={errorMessage} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 md:w-1/3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="example@gmail.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="......" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {loading && <Spinner />}
          <Button className="w-full mt-2" type="submit" disabled={loading}>
            {loading ? "loading" : "Login"}
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-center mt-2 w-1/2 md:w-1/3">
        <span className="flex-grow bg-gray-500 h-px "></span>
        <span className="px-2 text-gray-500">or</span>
        <span className="flex-grow bg-gray-500 h-px"></span>
      </div>
      <Button className="w-1/2 md:w-1/3 mt-2" onClick={signInWithGoogle}>
        <FcGoogle fontSize="1.7rem" />
        Sign in with google
      </Button>
      <Button variant="link" aschild>
        <Link className="" to="/register">
          Don't have an account?Sign up here
        </Link>
      </Button>
    </div>
  );
};

export default Login;
