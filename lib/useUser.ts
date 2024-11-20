/** @format */

"use client";
import { useQuery } from "@tanstack/react-query";

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other user properties as needed
}

export const useUser = () => {
  return useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Unauthorized");

      return response.json();
    },
    // Optional: Add retry and error handling configurations
    retry: 1,
    enabled: !!localStorage.getItem("token"),
  });
};
