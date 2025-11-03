import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get<any>("/api/categories"),
  });
}

