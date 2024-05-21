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

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MutwitterLogo />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/profilePhoto" element={<ProfilePhoto />}></Route>
        <Route path="/home" element={<Home />}>
          <Route path="explore" element={<Explore />}></Route>
          <Route path="following" element={<Following />}></Route>
          <Route path="mytweets" element={<MyTweets />}></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="createTweet" element={<CreateTweet />}></Route>
        </Route>
        <Route path="/username" element={<UsernameSetter />}></Route>
      </Routes>
    </>
  );
}

export default App
