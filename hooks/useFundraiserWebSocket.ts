import { useEffect, useRef, useState } from "react";

type Transaction = {
  id?: number;
  name: string | null;
  message: string | null;
  amount: number;
  date?: string;
};

type FundraiserData = {
  totalSum: number;
  donationCount: number;
  transactions: Transaction[];
};

export function useFundraiserWebSocket(
  fundraiserId: string | number,
  initialData: FundraiserData,
  wsUrl?: string,
): FundraiserData {
  const [data, setData] = useState(initialData);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!wsUrl) return;

    let hasConnected = false;
    let retryDelay = 1000;

    function connect() {
      if (!wsUrl) return;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        hasConnected = true;
        retryDelay = 1000;
        ws.send(JSON.stringify({ type: "subscribe", fundraiserId }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "donation" && String(msg.fundraiserId) === String(fundraiserId)) {
            setData((prev) => ({
              totalSum: prev.totalSum + msg.transaction.amount,
              donationCount: prev.donationCount + 1,
              transactions: [msg.transaction, ...prev.transactions],
            }));
          }
        } catch {}
      };

      ws.onclose = () => {
        if (!hasConnected) return; // Server doesn't support WebSockets, don't retry
        reconnectTimeout.current = setTimeout(() => {
          retryDelay = Math.min(retryDelay * 2, 30000);
          connect();
        }, retryDelay);
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
  }, [wsUrl, fundraiserId]);

  return data;
}
