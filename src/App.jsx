import './App.css'
import { Route, Routes } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import ProfilePhoto from './components/ProfilePhoto'
import Home from './components/Home';
import UsernameSetter from './components/UsernameSetter';
import Explore from './components/Explore';
import Following from './components/Following';
import MyTweets from './components/MyTweets';
import Profile from './components/Profile';
import { CreateTweet } from './components/CreateTweet';
import MutwitterLogo from './components/MutwitterLogo';
import FollowPeople from './components/FollowPeople';
import UserProfile from './components/UserProfile';
import FollowersAndFollowing from './components/FollowersAndFollowing';
import Thread from './components/Thread';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MutwitterLogo />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route
          path="/profilePhoto"
          element={<ProfilePhoto destination="/username" userExists={false} />}
        ></Route>
        <Route path="/home" element={<Home />}>
          <Route path="explore" element={<Explore />}></Route>
          <Route path="following" element={<Following />}></Route>
          <Route path="people" element={<FollowPeople />}></Route>
          <Route path="mytweets" element={<MyTweets />}></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="createTweet" element={<CreateTweet />}></Route>
          <Route path="user" element={<UserProfile />}></Route>
          <Route
            path="followersAndFollowing"
            element={<FollowersAndFollowing />}
          ></Route>
          <Route path=":id" element={<Thread />}></Route>
        </Route>
        <Route
          path="/username"
          element={<UsernameSetter destination="/home/explore" />}
        ></Route>
      </Routes>
    </>
  );
}

export default App
