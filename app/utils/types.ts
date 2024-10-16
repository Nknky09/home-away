export type actionFunction = (
  revState: any,
  formData: FormData
) => Promise<{ message: string }>;
