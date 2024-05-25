import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import UsernameSetter from "./UsernameSetter";
import ProfilePhoto from "./ProfilePhoto";

const ChangeProfilePic = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Change profile picture</Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Change profile picture</DialogTitle>
          <DialogDescription>
            Change your profile pic in this platform
          </DialogDescription>
        </DialogHeader>
        <ProfilePhoto destination="/home/profile" userExists={true} />
      </DialogContent>
    </Dialog>
  );
};

export default ChangeProfilePic;
