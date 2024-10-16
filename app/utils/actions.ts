"use server";

import { profileSchema } from "./schemas";

export const createProfileAction = async (
  prevState: any,
  FormData: FormData
) => {
  try {
    const rawData = Object.fromEntries(FormData);
    const validatedFields = profileSchema.parse(rawData);
    console.log(validatedFields);
    return { message: "profile created" };
  } catch (error) {
    console.log(error);
    return { message: "there was an error" };
  }
};
