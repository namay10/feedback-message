"use client";
import { z } from "zod";
import { verifySchema } from "@/schemas/verify.schema";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VerifyPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      toast({
        title: "Could not verify code",
        description: "An error occurred while verifying your code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-50 via-amber-50 to-rose-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6 ">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Verify Your Account
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Please enter the code sent to your email
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-colors duration-200 rounded-lg p-3"
                      placeholder="Enter your code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyPage;
