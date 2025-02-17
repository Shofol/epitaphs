import { toast } from "@/hooks/use-toast";

const toastService = {
  success: (message: string) =>
    toast({
      variant: "success",
      title: "Success",
      description: `${message}`,
    }),
  error: (message: string) =>
    toast({
      variant: "destructive",
      title: "Error!",
      description: `${message}`,
    }),
};

export default toastService;
