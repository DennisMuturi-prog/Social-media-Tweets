import { auth, db } from '@/config/firebase'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { get } from 'react-hook-form'
import { AlertDestructive } from './AlertDestructive'
import Person from './Person'

const FollowPeople = () => {
    const [usersDetails,setUsersDetails]=useState([]);
    const [errorMessage,setErrorMessage]=useState('');
    const [myUserDetails,setMyUserDetails]=useState({});
    const getPeopleDetails=()=>{
        try {
            const usersRef=collection(db,'users');
            onSnapshot(usersRef,(querySnapshot)=>{
                const usersData=querySnapshot.docs.map((doc)=>({...doc.data(),id:doc.id}));
                const myuserdetails=usersData.filter(user=>user.userId==auth.currentUser.uid);
                setMyUserDetails(myuserdetails[0]);
                setUsersDetails(usersData);
            })                                                                                               
            
        } catch (error) {
            setErrorMessage(error.message);      
        }
    }
    useEffect(()=>{
        getPeopleDetails();
    },[])
  return (
    <>
      {errorMessage&&<AlertDestructive errorMessage={errorMessage} />}
      <div>
        {usersDetails.map((userDetails,id)=>{
            if(userDetails.userId!==auth.currentUser.uid){
                return <Person key={id} userDetails={userDetails} myUserDetails={myUserDetails} setErrorMessage={setErrorMessage}/>;
            }
            else{
                return null;
            }
          
        }
        )}
      </div>
    </>
  );
}

export default FollowPeople