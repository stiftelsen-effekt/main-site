import React, { useEffect, useState } from "react";
import { Box, Stack, Card, Text, Spinner, Flex, TextInput, Label, Button } from "@sanity/ui";
import { SearchIcon } from "@sanity/icons";
import { PatchEvent, set, unset } from "sanity";
import { format } from "date-fns";

// Types for transaction data
type Transaction = {
  id: number;
  name: string;
  message: string;
  amount: number;
  date: string;
};

interface FundraiserTransactionsInputProps {
  value?: number[]; // This will store the selected transaction IDs as an array
  onChange: (event: PatchEvent) => void;
}

const api = process.env.SANITY_STUDIO_EFFEKT_API_URL;

// FundraiserTransactionsInput Component (main input component for Sanity)
export const FundraiserTransactionsInput = React.forwardRef<
  HTMLDivElement,
  FundraiserTransactionsInputProps
>((props, ref) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>(props.value || []);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch transactions for a specific fundraiser
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api}/fundraisers/2`); // Hardcoded to fundraiser ID 2

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (data && data.content && data.content.transactions) {
        // Sort by most recent first
        const sortedData = [...data.content.transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setTransactions(sortedData);
        setFilteredTransactions(sortedData);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Update the parent value when selection changes
  useEffect(() => {
    // Only update if there's an actual change
    if (JSON.stringify(selectedIds) !== JSON.stringify(props.value)) {
      props.onChange(PatchEvent.from(selectedIds.length > 0 ? set(selectedIds) : unset()));
    }
  }, [selectedIds]);

  // Filter transactions based on search term (name or amount)
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((transaction) => {
        // Search by name
        const nameMatch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase());
        // Search by amount
        const amountMatch = transaction.amount.toString().includes(searchTerm);
        return nameMatch || amountMatch;
      });
      setFilteredTransactions(filtered);
    }
  }, [searchTerm, transactions]);

  // Handle selection/deselection
  const handleSelectTransaction = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        // Deselect if already selected
        return prev.filter((itemId) => itemId !== id);
      } else {
        // Add to selection
        return [...prev, id];
      }
    });
  };

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Format date for display with time
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  // Format amount as currency with no decimals
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (error) return <Text>{error}</Text>;

  return (
    <div ref={ref}>
      <Stack space={4}>
        {/* Search input */}
        <Flex>
          <Box flex={1}>
            <Stack space={2}>
              <Flex>
                <Box flex={1}>
                  <TextInput
                    id="transaction-search"
                    icon={SearchIcon}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by donor name or amount"
                  />
                </Box>
              </Flex>
            </Stack>
          </Box>
        </Flex>

        {/* Selected transactions counter */}
        <Box>
          <Text weight="semibold">
            {selectedIds.length} transaction{selectedIds.length !== 1 ? "s" : ""} selected
          </Text>
        </Box>

        {/* Transaction list */}
        <Card padding={0} radius={2} shadow={1} style={{ height: "300px", overflow: "auto" }}>
          {loading ? (
            <Flex padding={4} justify="center" align="center">
              <Spinner />
            </Flex>
          ) : (
            <Stack space={1}>
              {filteredTransactions.length === 0 ? (
                <Box padding={4} style={{ textAlign: "center" }}>
                  <Text>
                    {searchTerm ? "No matching transactions found" : "No transactions available"}
                  </Text>
                </Box>
              ) : (
                filteredTransactions.map((transaction) => (
                  <Card
                    key={transaction.id}
                    padding={3}
                    radius={1}
                    tone={selectedIds.includes(transaction.id) ? "primary" : "default"}
                    onClick={() => handleSelectTransaction(transaction.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Flex align="center">
                      <Box marginRight={3}>
                        <Card
                          padding={2}
                          radius={2}
                          border
                          style={{ width: "40px", textAlign: "center" }}
                        >
                          <Text size={1}>{transaction.id}</Text>
                        </Card>
                      </Box>

                      <Stack space={2} flex={1}>
                        <Text weight="semibold">{transaction.name}</Text>
                        <Flex align="center">
                          <Box flex={1}>
                            <Text size={1} muted>
                              {formatDate(transaction.date)}
                            </Text>
                          </Box>
                        </Flex>
                      </Stack>

                      <Box>
                        <Text size={2} weight="semibold" align="right">
                          {formatAmount(transaction.amount)}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                ))
              )}
            </Stack>
          )}
        </Card>
      </Stack>
    </div>
  );
});
