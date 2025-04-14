import React, { useEffect, useState } from "react";
import { Box, Stack, Card, Text, Spinner, Flex, TextInput, Label } from "@sanity/ui";
import { SearchIcon } from "@sanity/icons";
import { PatchEvent, set, unset } from "sanity";
import { format } from "date-fns";

// Types for our data structures
type Donor = {
  id: number;
  name: string;
};

type Fundraiser = {
  id: number;
  registered: string;
  lastUpdated: string;
  donor: Donor;
};

interface FundraiserInputProps {
  value?: number; // This will store the selected fundraiser ID
  onChange: (event: PatchEvent) => void;
}

const api = process.env.SANITY_STUDIO_EFFEKT_API_URL;

// FundraiserInput Component (main input component for Sanity)
export const FundraiserInput = React.forwardRef<HTMLDivElement, FundraiserInputProps>(
  (props, ref) => {
    const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
    const [filteredFundraisers, setFilteredFundraisers] = useState<Fundraiser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<number | undefined>(props.value);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Fetch all fundraisers
    const fetchFundraisers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api}/fundraisers/list`);

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        if (data && data.content) {
          // Sort by most recent first
          const sortedData = [...data.content].sort(
            (a, b) => new Date(b.registered).getTime() - new Date(a.registered).getTime(),
          );

          setFundraisers(sortedData);
          setFilteredFundraisers(sortedData);
        }
      } catch (err) {
        console.error("Error fetching fundraisers:", err);
        setError("Failed to load fundraisers");
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    useEffect(() => {
      fetchFundraisers();
    }, []);

    // Update the parent value when selection changes
    useEffect(() => {
      if (selectedId !== props.value) {
        props.onChange(PatchEvent.from(selectedId ? set(selectedId) : unset()));
      }
    }, [selectedId]);

    // Filter fundraisers based on search term
    useEffect(() => {
      if (searchTerm.trim() === "") {
        setFilteredFundraisers(fundraisers);
      } else {
        const filtered = fundraisers.filter((fundraiser) =>
          fundraiser.donor.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredFundraisers(filtered);
      }
    }, [searchTerm, fundraisers]);

    // Handle selection
    const handleSelectFundraiser = (id: number) => {
      setSelectedId(id);
    };

    // Handle search input changes
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
      try {
        return format(new Date(dateString), "PPP");
      } catch (e) {
        return dateString;
      }
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
                      id="fundraiser-search"
                      icon={SearchIcon}
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search by donor name"
                    />
                  </Box>
                </Flex>
              </Stack>
            </Box>
          </Flex>

          {/* Fundraiser list */}
          <Card padding={0} radius={2} shadow={1} style={{ height: "200px", overflow: "auto" }}>
            {loading ? (
              <Flex padding={4} justify="center" align="center">
                <Spinner />
              </Flex>
            ) : (
              <Stack space={1}>
                {filteredFundraisers.length === 0 ? (
                  <Box padding={4} style={{ textAlign: "center" }}>
                    <Text>
                      {searchTerm ? "No matching fundraisers found" : "No fundraisers available"}
                    </Text>
                  </Box>
                ) : (
                  filteredFundraisers.map((fundraiser) => (
                    <Card
                      key={fundraiser.id}
                      padding={3}
                      radius={1}
                      tone={selectedId === fundraiser.id ? "primary" : "default"}
                      onClick={() => handleSelectFundraiser(fundraiser.id)}
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
                            <Text size={1}>{fundraiser.id}</Text>
                          </Card>
                        </Box>

                        <Stack space={2} flex={1}>
                          <Text weight="semibold">{fundraiser.donor.name}</Text>
                          <Text size={1} muted>
                            Registered {formatDate(fundraiser.registered)}
                          </Text>
                        </Stack>

                        {selectedId === fundraiser.id && (
                          <Box>
                            <Text size={3} weight="semibold">
                              ✓
                            </Text>
                          </Box>
                        )}
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
  },
);
