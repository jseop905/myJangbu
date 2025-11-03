import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: () => apiClient.get<any>("/api/accounts"),
  });
}

