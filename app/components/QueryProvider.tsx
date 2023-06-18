"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const QueryWrapper = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5000,
          // suspense: true,
          refetchOnWindowFocus: true,
        },
      },
    })
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryWrapper;
