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

const ChangeUsername = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Change Username</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Username</DialogTitle>
          <DialogDescription>
            Change your profile username in this platform
          </DialogDescription>
        </DialogHeader>
        <UsernameSetter destination="/home/profile" />
      </DialogContent>
    </Dialog>
  );
};

export default ChangeUsername;
