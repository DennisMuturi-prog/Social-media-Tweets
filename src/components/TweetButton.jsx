import { Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const TweetButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/home/createTweet") {
    return null;
  }
  return (
    <>
      <Button
        onClick={() => {
          navigate("/home/createTweet");
        }}
        className="fixed bottom-2 right-2"
      >
        <Pencil />
      </Button>
    </>
  );
};

export default TweetButton;
