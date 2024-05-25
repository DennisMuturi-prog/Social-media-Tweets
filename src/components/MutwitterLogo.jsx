import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useEffect } from 'react';
import "../App.css";

const MutwitterLogo = () => {
    const navigate=useNavigate();
     useEffect(() => {
       const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         if (currentUser) {
            navigate('/home/explore');
            console.log('y');
           }
           else{
            navigate('/login');
           }
         })

       // Cleanup subscription on unmount
       return () => unsubscribe();
     }, []);
  return (
    <div className='flex  flex-col  h-lvh justify-center items-center background-image'>
        <h1 className='text-lg font-bold'>MUTWIRRER</h1>
        <p>You can tweet as you like</p>
    </div>
  )
}

export default MutwitterLogo