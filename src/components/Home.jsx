import { Outlet } from "react-router-dom"
import NavigationBar from "./NavigationBar"
import User from "./User"
import TweetButton from "./TweetButton"

const Home = () => {
  return (
    <div>
      <h1>MUTWIRRER</h1>
      <div className="flex">
        <NavigationBar />
        <User />
      </div>
      <TweetButton/>
      <Outlet />
    </div>
  );
}

export default Home