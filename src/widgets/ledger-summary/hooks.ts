import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";

export function useLedgerSummary(from: string, to: string) {
  return useQuery({
    queryKey: ["ledger-summary", from, to],
    queryFn: () => apiClient.get<any>(`/api/ledger/summary?from=${from}&to=${to}`),
    enabled: !!from && !!to,
  });
}

