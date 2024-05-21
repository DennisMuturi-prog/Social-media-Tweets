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
import {createUserWithEmailAndPassword, signInWithPopup, updateProfile} from 'firebase/auth'
import { auth, provider } from "@/config/firebase";
import { useState } from "react";
import { AlertDestructive } from "./AlertDestructive";
import Spinner from "./Spinner";

const formSchema = yup.object({
  firstName: yup.string().required(),
  secondName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
const Register = () => {
  const navigate=useNavigate();
  const [loading,setLoading]=useState(false);
  const [errorMessage,setErrorMessage]=useState('');
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      firstName: "",
      secondName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');
    const {firstName,secondName,email,password}=data;
    try {
      const user=await createUserWithEmailAndPassword(auth,email,password);
      console.log(user);
      updateProfile(auth.currentUser,{
        displayName:`${firstName} ${secondName}`
      }).then((updateResponse)=>{
        console.log(updateResponse);
        navigate('/profilePhoto');
      })
      
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
      setLoading(false);
    }

    console.log(data);
  };
  const signUpWithGoogle=()=>{
    setErrorMessage('');
    signInWithPopup(auth,provider)
    .then((result)=>{
      const user=result.user;
      console.log(user);
    }).catch((error)=>{
      setErrorMessage(error.message);
    })
  }
  return (
    <div className="flex flex-col justify-center items-center shadow">
      {errorMessage && <AlertDestructive errorMessage={errorMessage} />}
      <h1 className="font-bold mb-2">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 md:w-1/3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Second Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="......" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {loading&&<Spinner/>}
          <Button className="w-full mt-2" type="submit" disabled={loading}>
            {loading?'loading':'Sign up'}
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-center mt-2 w-1/2 md:w-1/3">
        <span className="flex-grow bg-gray-500 h-px "></span>
        <span className="px-2 text-gray-500">or</span>
        <span className="flex-grow bg-gray-500 h-px"></span>
      </div>
      <Button className="w-1/2 md:w-1/3 mt-2" onClick={signUpWithGoogle}>
        <FcGoogle fontSize="1.7rem" />
        Sign up with google
      </Button>
      <Button variant="link" aschild>
        <Link className="" to="/login">
          Already have an account?login here
        </Link>
      </Button>
    </div>
  );
};

export default Register;
