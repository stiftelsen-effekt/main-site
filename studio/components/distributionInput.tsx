import React, { useEffect, useState } from "react";
import { Box, Stack, Card, Text, Button, Select, Label, TextInput, Flex } from "@sanity/ui";
import { ArrayOfObjectsInputProps, PatchEvent, set, unset } from "sanity";
import { TrashIcon, AddIcon } from "@sanity/icons";

// Types for our data structures
type CauseArea = {
  id: number;
  name: string;
  isActive: boolean;
  standardPercentageShare: number;
  organizations: Organization[];
};

type Organization = {
  id: number;
  name: string;
  widgetDisplayName: string | null;
  standardShare: number;
  isActive: boolean;
  ordering: number;
  causeAreaId: number;
};

// Updated to include _key property
type DistributionItem = {
  _key: string; // Required by Sanity for array items
  type: "causeArea" | "organization";
  id: number;
  causeAreaId?: number;
  percentage: number;
  name?: string; // Store name for display purposes
};

interface DistributionInputProps {
  value?: DistributionItem[];
  onChange: (event: PatchEvent) => void;
}

// Helper function to generate a unique key
const generateKey = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Helper function to ensure all items have _key properties
const ensureKeys = (items: any[]): DistributionItem[] => {
  return items.map((item) => {
    if (!item._key) {
      return {
        ...item,
        _key: generateKey(),
      };
    }
    return item;
  });
};

const api = process.env.SANITY_STUDIO_EFFEKT_API_URL;

// DistributionInput Component (main input component for Sanity)
export const DistributionInput = (props: ArrayOfObjectsInputProps) => {
  // Ensure all initial values have _key property
  const initialDistributions = props.value ? ensureKeys(props.value) : [];

  const [distributions, setDistributions] = useState<DistributionItem[]>(initialDistributions);
  const [causeAreas, setCauseAreas] = useState<CauseArea[]>([]);
  const [allCauseAreas, setAllCauseAreas] = useState<CauseArea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all cause areas and organizations for displaying names
  useEffect(() => {
    setLoading(true);
    fetch(`${api}/causeareas/all`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.content) {
          const activeCauseAreas = data.content.filter((area: CauseArea) => area.isActive);
          setAllCauseAreas(data.content);
          setCauseAreas(activeCauseAreas);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load cause areas");
        setLoading(false);
      });
  }, []);

  // Update the parent value when distributions change
  useEffect(() => {
    if (distributions !== props.value) {
      props.onChange(PatchEvent.from(distributions.length ? set(distributions) : unset()));
    }
  }, [distributions]);

  // Initialize from props
  useEffect(() => {
    if (props.value && props.value.length > 0) {
      // Ensure all values have _key property
      setDistributions(ensureKeys(props.value));
    }
  }, []);

  // Get name for a cause area
  const getCauseAreaName = (causeAreaId: number): string => {
    const causeArea = allCauseAreas.find((area) => area.id === causeAreaId);
    return causeArea ? causeArea.name : `Cause Area ${causeAreaId}`;
  };

  // Get name for an organization
  const getOrganizationName = (orgId: number, causeAreaId: number): string => {
    const causeArea = allCauseAreas.find((area) => area.id === causeAreaId);
    if (!causeArea) return `Organization ${orgId}`;

    const org = causeArea.organizations.find((org) => org.id === orgId);
    return org ? org.widgetDisplayName || org.name : `Organization ${orgId}`;
  };

  // Add a cause area to the distribution
  const addCauseArea = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const causeAreaId = parseInt(event.currentTarget.value, 10);
    if (isNaN(causeAreaId)) return;

    // Check if this cause area is already in the distribution
    const existingIndex = distributions.findIndex(
      (dist) => dist.type === "causeArea" && dist.id === causeAreaId,
    );

    if (existingIndex >= 0) {
      // Cause area already exists, do nothing
      return;
    }

    // Check if this is the first cause area being added
    const existingCauseAreas = distributions.filter((dist) => dist.type === "causeArea");
    const isFirstCauseArea = existingCauseAreas.length === 0;

    // Add new cause area with a _key and default percentage (100% if first, 0% otherwise)
    const newDistribution: DistributionItem = {
      _key: generateKey(),
      type: "causeArea",
      id: causeAreaId,
      percentage: isFirstCauseArea ? 100 : 0,
      name: getCauseAreaName(causeAreaId),
    };

    setDistributions([...distributions, newDistribution]);

    // Reset the select to default value
    event.currentTarget.value = "";
  };

  // Add an organization to the distribution
  const addOrganization = (causeAreaId: number, event: React.FormEvent<HTMLSelectElement>) => {
    const orgId = parseInt(event.currentTarget.value, 10);
    if (isNaN(orgId)) return;

    // Check if this organization already exists
    const existingIndex = distributions.findIndex(
      (dist) =>
        dist.type === "organization" && dist.id === orgId && dist.causeAreaId === causeAreaId,
    );

    if (existingIndex >= 0) {
      // Organization already exists, do nothing
      return;
    }

    // Check if this is the first organization for this cause area
    const existingOrgsForCauseArea = distributions.filter(
      (dist) => dist.type === "organization" && dist.causeAreaId === causeAreaId,
    );
    const isFirstOrganization = existingOrgsForCauseArea.length === 0;

    // Add new organization with default percentage (100% if first, 0% otherwise)
    const newDistribution: DistributionItem = {
      _key: generateKey(),
      type: "organization",
      id: orgId,
      causeAreaId: causeAreaId,
      percentage: isFirstOrganization ? 100 : 0,
      name: getOrganizationName(orgId, causeAreaId),
    };

    setDistributions([...distributions, newDistribution]);

    // Reset the select to default value
    event.currentTarget.value = "";
  };

  // Remove an item from the distribution
  const removeDistribution = (key: string) => {
    const itemToRemove = distributions.find((dist) => dist._key === key);

    if (itemToRemove && itemToRemove.type === "causeArea") {
      // If removing a cause area, also remove all organizations belonging to it
      const newDistributions = distributions.filter(
        (dist) =>
          dist._key !== key &&
          !(dist.type === "organization" && dist.causeAreaId === itemToRemove.id),
      );
      setDistributions(newDistributions);
    } else {
      // Just remove the single item
      const newDistributions = distributions.filter((dist) => dist._key !== key);
      setDistributions(newDistributions);
    }
  };

  // Update item percentage
  const updateItemPercentage = (key: string, newPercentage: number) => {
    const validPercentage = isNaN(newPercentage) ? 0 : Math.min(100, Math.max(0, newPercentage));

    const newDistributions = distributions.map((item) => {
      if (item._key === key) {
        return {
          ...item,
          percentage: validPercentage,
        };
      }
      return item;
    });

    setDistributions(newDistributions);
  };

  // Calculate total percentages for validation
  const calculateTotals = () => {
    const causeAreaTotal = distributions
      .filter((dist) => dist.type === "causeArea")
      .reduce((sum, item) => sum + item.percentage, 0);

    const orgTotals: Record<number, number> = {};

    distributions
      .filter((dist) => dist.type === "organization" && dist.causeAreaId)
      .forEach((item) => {
        const causeAreaId = item.causeAreaId as number;
        orgTotals[causeAreaId] = (orgTotals[causeAreaId] || 0) + item.percentage;
      });

    return { causeAreaTotal, orgTotals };
  };

  // Group organizations by cause area
  const getOrganizationsByCauseArea = (causeAreaId: number) => {
    return distributions.filter(
      (dist) => dist.type === "organization" && dist.causeAreaId === causeAreaId,
    );
  };

  // Get available organizations for a cause area (not already added)
  const getAvailableOrganizations = (causeAreaId: number) => {
    const causeArea = causeAreas.find((area) => area.id === causeAreaId);
    if (!causeArea) return [];

    const activeOrgs = causeArea.organizations.filter((org) => org.isActive);

    // Filter out organizations that are already in the distribution
    const existingOrgIds = distributions
      .filter((dist) => dist.type === "organization" && dist.causeAreaId === causeAreaId)
      .map((dist) => dist.id);

    return activeOrgs.filter((org) => !existingOrgIds.includes(org.id));
  };

  // Get available cause areas (not already added)
  const getAvailableCauseAreas = () => {
    const existingCauseAreaIds = distributions
      .filter((dist) => dist.type === "causeArea")
      .map((dist) => dist.id);

    return causeAreas.filter((area) => !existingCauseAreaIds.includes(area.id));
  };

  const { causeAreaTotal, orgTotals } = calculateTotals();

  // Get all cause areas in the distribution
  const causeAreasInDistribution = distributions.filter((dist) => dist.type === "causeArea");

  if (loading) return <Text>Loading data...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <div>
      <Stack space={4}>
        {/* Distribution Overview - Cause Areas and their Organizations */}

        {distributions.length === 0 ? (
          <></>
        ) : (
          <Stack space={3}>
            {causeAreaTotal !== 100 && distributions.some((d) => d.type === "causeArea") && (
              <Text size={1}>
                Cause area percentages should sum to 100%. Current total: {causeAreaTotal}%
              </Text>
            )}

            {causeAreasInDistribution.map((causeAreaItem) => (
              <Card key={causeAreaItem._key} padding={3} radius={2} tone="default" border>
                <Stack space={3}>
                  {/* Cause Area Header */}
                  <Card padding={2} radius={2} tone="primary">
                    <Flex align="center">
                      <Box flex={1}>
                        <Text weight="semibold">
                          {causeAreaItem.name || `Cause Area ${causeAreaItem.id}`}
                        </Text>
                      </Box>

                      <Flex align="center" gap={2}>
                        <Label htmlFor={`ca-pct-${causeAreaItem._key}`} style={{ margin: 0 }}>
                          Percentage:
                        </Label>
                        <TextInput
                          id={`ca-pct-${causeAreaItem._key}`}
                          type="number"
                          value={causeAreaItem.percentage.toString()}
                          onChange={(e) =>
                            updateItemPercentage(
                              causeAreaItem._key,
                              parseInt(e.currentTarget.value, 10),
                            )
                          }
                          min={0}
                          max={100}
                          style={{ width: "80px" }}
                        />
                        <Button
                          icon={TrashIcon}
                          onClick={() => removeDistribution(causeAreaItem._key)}
                          tone="critical"
                          mode="ghost"
                        />
                      </Flex>
                    </Flex>
                  </Card>

                  {/* Organizations within this Cause Area */}
                  <Stack space={2}>
                    <Text size={1} weight="semibold">
                      Organizations:
                    </Text>

                    {getOrganizationsByCauseArea(causeAreaItem.id).length === 0 ? (
                      <></>
                    ) : (
                      getOrganizationsByCauseArea(causeAreaItem.id).map((orgItem) => (
                        <Card key={orgItem._key} padding={2} radius={2} border tone="default">
                          <Flex align="center">
                            <Box flex={1}>
                              <Text>{orgItem.name || `Organization ${orgItem.id}`}</Text>
                            </Box>

                            <Flex align="center" gap={2}>
                              <Label htmlFor={`org-pct-${orgItem._key}`} style={{ margin: 0 }}>
                                Percentage:
                              </Label>
                              <TextInput
                                id={`org-pct-${orgItem._key}`}
                                type="number"
                                value={orgItem.percentage.toString()}
                                onChange={(e) =>
                                  updateItemPercentage(
                                    orgItem._key,
                                    parseInt(e.currentTarget.value, 10),
                                  )
                                }
                                min={0}
                                max={100}
                                style={{ width: "80px" }}
                              />
                              <Button
                                icon={TrashIcon}
                                onClick={() => removeDistribution(orgItem._key)}
                                tone="critical"
                                mode="ghost"
                              />
                            </Flex>
                          </Flex>
                        </Card>
                      ))
                    )}

                    {/* Show organization total percentage */}
                    {causeAreaItem.id in orgTotals && orgTotals[causeAreaItem.id] != 100 && (
                      <Text size={1}>Organizations total: {orgTotals[causeAreaItem.id]}%</Text>
                    )}
                  </Stack>

                  {/* Add new organization */}
                  <Card padding={2} radius={2} border tone="default">
                    <Flex align="center">
                      <Box flex={1}>
                        <Label htmlFor={`add-org-${causeAreaItem.id}`}>Add Organization</Label>
                      </Box>
                      <Box flex={1}>
                        <Select
                          id={`add-org-${causeAreaItem.id}`}
                          onChange={(e) => addOrganization(causeAreaItem.id, e)}
                          value=""
                        >
                          <option value="">Select an organization</option>
                          {getAvailableOrganizations(causeAreaItem.id).map((org) => (
                            <option key={org.id} value={org.id.toString()}>
                              {org.widgetDisplayName || org.name}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    </Flex>
                  </Card>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}

        {/* Add new cause area */}
        {getAvailableCauseAreas().length > 0 && (
          <Card padding={3} radius={2} tone="default" border>
            <Stack space={3}>
              <Flex align="center">
                <Box flex={1}>
                  <Label htmlFor="new-cause-area">Add Cause Area</Label>
                </Box>
                <Box flex={1}>
                  <Select id="new-cause-area" onChange={addCauseArea} value="">
                    <option value="">Select a cause area</option>
                    {getAvailableCauseAreas().map((area) => (
                      <option key={area.id} value={area.id.toString()}>
                        {area.name}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Flex>
            </Stack>
          </Card>
        )}
      </Stack>
    </div>
  );
};
