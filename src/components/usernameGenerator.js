import { collection, getDocs, query, where } from "firebase/firestore"; 
import {db}  from '../config/firebase'

const usersRef=collection(db,'users');

const checkUsernameAvailability=async (username)=>{
    const q=query(usersRef,where('username','==',username));
    const data=await getDocs(q);
    if(data.docs.length){
        console.log('username not available');
        return false;
    }
    else{
        return true;
    }
}
export const generateUniqueUsername=async (username)=>{
    const availabiltyOfName=await checkUsernameAvailability(username);
    if(availabiltyOfName){
        return username;
    }
    else{
        const uniqueUsername=username+getRandomInt();
        console.log(typeof uniqueUsername);
        return await generateUniqueUsername(uniqueUsername);
    }
}
function getRandomInt() {
  const min = 1;
  const max = 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}