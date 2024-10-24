"use client";

import { useState, useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { actionFunction } from "@/app/utils/types";

const initialState = {
  message: "",
};

function FormContainer({
  action,
  children,
}: {
  action: actionFunction;
  children: React.ReactNode;
}) {
  const [state, setState] = useState(initialState);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(event.currentTarget);
    const response = await action(formData); // Call the action function with form data
    setState(response);
  };

  useEffect(() => {
    if (state.message) {
      toast({ description: state.message });
    }
  }, [state, toast]);

  return <form onSubmit={handleSubmit}>{children}</form>;
}
export default FormContainer;
