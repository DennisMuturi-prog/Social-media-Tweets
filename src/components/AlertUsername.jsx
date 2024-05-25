import { CircleCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AlertUsername = () => {
  return (
    <Alert>
      <CircleCheck className="h-4 w-4" />
      <AlertTitle>Username updated!</AlertTitle>
      <AlertDescription>
        successfully updated your username
      </AlertDescription>
    </Alert>
  );
};

export default AlertUsername;
