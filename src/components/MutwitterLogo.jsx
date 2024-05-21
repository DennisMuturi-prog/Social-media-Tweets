import React from 'react'
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useEffect } from 'react';

const MutwitterLogo = () => {
    const navigate=useNavigate();
     useEffect(() => {
       const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         if (currentUser) {
            //navigate('/');
            console.log('yes');
           }
           else{
            navigate('/login');
           }
         })

       // Cleanup subscription on unmount
       return () => unsubscribe();
     }, []);
  return (
    <div className='flex  flex-col justify-center items-center'>
        <h1>MUTWIRRER</h1>
        <p>You can tweet as you like</p>
    </div>
  )
}

export default MutwitterLogo