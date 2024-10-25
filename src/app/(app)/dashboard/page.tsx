"use client";

import { useCallback, useEffect, useState } from "react";
import { message } from "@/models/Content.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { acceptMessageSchema } from "@/schemas/acceptMessage.schema";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { Box, CircularProgress } from "@mui/material";

const Page = () => {
  const [messages, setMessages] = useState([] as message[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAccept = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/acceptmessage");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch message setting",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/getmessage");
        setMessages(response.data.message || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Successfully refreshed messages",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAccept();
  }, [session, fetchMessages, fetchAccept]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/acceptmessage", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch message setting",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId),
    );
  };

  const username = session?.user?.username;
  if (!username) {
    return (
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "top",
            marginTop: "10vh",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </div>
    );
  }
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/x/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      description: "Copied to clipboard",
      variant: "default",
    });
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-gray-50 shadow-md rounded-lg w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        User Dashboard
      </h1>

      {/* Profile Link Section */}
      <div className="mb-8 p-4 bg-white shadow rounded-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Copy Your Unique Profile Link
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 bg-gray-200 rounded-md"
          />
          <Button
            onClick={copyToClipboard}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            Copy Link
          </Button>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="mb-6 p-4 bg-white shadow rounded-md">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Message Settings
          </h2>
          <div className="flex items-center">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="mr-2"
            />
            <span className="text-gray-600">
              Accept Messages:{" "}
              <strong className="text-gray-800">
                {acceptMessages ? "On" : "Off"}
              </strong>
            </span>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Refresh Messages Button */}
      <div className="flex justify-end">
        <Button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          {isLoading ? "Loading..." : "Refresh Messages"}
        </Button>
      </div>

      {/* Message Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No messages to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
