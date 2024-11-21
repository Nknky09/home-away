"use client";

import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { actionFunction } from "@/app/utils/types";

const initialState = {
  message: "",
};

function FormContainer({
  action,
  children,
}: {
  action: (prevState: any, formData: FormData) => Promise<{ message: string }>;
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [state, setState] = useState(initialState);

  // Form submission handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form behavior

    const formData = new FormData(event.currentTarget); // Create FormData object from the form

    try {
      // Pass the current state and formData to the action function
      const result = await action(state, formData);

      // Update state and show success toast
      setState(result);
      if (result?.message) {
        toast({ description: result.message });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({ description: "An error occurred. Please try again." }); // Show error toast
    }
  };

  return <form onSubmit={handleSubmit}>{children}</form>;
}

export default FormContainer;
