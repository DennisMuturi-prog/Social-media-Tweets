import { CircleCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertProfilePhoto() {
  return (
    <Alert>
      <CircleCheck className="h-4 w-4" />
      <AlertTitle>Upload successful!</AlertTitle>
      <AlertDescription>
        Your profile photo has been added successfullly
      </AlertDescription>
    </Alert>
  );
}
