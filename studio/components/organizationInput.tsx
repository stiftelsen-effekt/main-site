import React, { useEffect, useState } from "react";
import { Stack, Card, Text, Select, Label, Flex, Box } from "@sanity/ui";
import { PatchEvent, set, unset } from "sanity";

// Types for our data structures
type CauseArea = {
  id: number;
  name: string;
  isActive: boolean;
  organizations: Organization[];
};

type Organization = {
  id: number;
  name: string;
  widgetDisplayName: string | null;
  isActive: boolean;
  causeAreaId: number;
};

// The value we'll store in Sanity
type OrganizationReference = {
  cause_area_id: number;
  organization_id: number;
};

interface OrganizationSelectorProps {
  value?: OrganizationReference;
  onChange: (event: PatchEvent) => void;
}

const api = process.env.SANITY_STUDIO_EFFEKT_API_URL;

// OrganizationSelector Component for Sanity
export const OrganizationSelector = React.forwardRef<HTMLDivElement, OrganizationSelectorProps>(
  (props, ref) => {
    const [causeAreas, setCauseAreas] = useState<CauseArea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedCauseAreaId, setSelectedCauseAreaId] = useState<number | null>(
      props.value?.cause_area_id || null,
    );
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(
      props.value?.organization_id || null,
    );

    // Fetch all cause areas and organizations
    useEffect(() => {
      setLoading(true);
      fetch(`${api}/causeareas/all`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.content) {
            // Filter to only active cause areas
            const activeCauseAreas = data.content.filter((area: CauseArea) => area.isActive);
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

    // Initialize selected values from props if they exist
    useEffect(() => {
      if (props.value) {
        setSelectedCauseAreaId(props.value.cause_area_id);
        setSelectedOrganizationId(props.value.organization_id);
      }
    }, [props.value]);

    // Handle cause area selection
    const handleCauseAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const causeAreaId = parseInt(event.currentTarget.value, 10);

      if (isNaN(causeAreaId)) {
        // Empty selection
        setSelectedCauseAreaId(null);
        setSelectedOrganizationId(null);
        props.onChange(PatchEvent.from(unset()));
        return;
      }

      setSelectedCauseAreaId(causeAreaId);
      setSelectedOrganizationId(null);

      // Update Sanity value (only cause area for now)
      if (causeAreaId) {
        props.onChange(
          PatchEvent.from(
            set({
              cause_area_id: causeAreaId,
              organization_id: null,
            }),
          ),
        );
      }
    };

    // Handle organization selection
    const handleOrganizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const organizationId = parseInt(event.currentTarget.value, 10);

      if (isNaN(organizationId)) {
        // Empty selection
        setSelectedOrganizationId(null);

        // Update Sanity with just the cause area
        if (selectedCauseAreaId) {
          props.onChange(
            PatchEvent.from(
              set({
                cause_area_id: selectedCauseAreaId,
                organization_id: null,
              }),
            ),
          );
        }
        return;
      }

      setSelectedOrganizationId(organizationId);

      // Update Sanity with both values
      if (selectedCauseAreaId) {
        props.onChange(
          PatchEvent.from(
            set({
              cause_area_id: selectedCauseAreaId,
              organization_id: organizationId,
            }),
          ),
        );
      }
    };

    // Get available organizations for the selected cause area
    const getAvailableOrganizations = () => {
      if (!selectedCauseAreaId) return [];

      const causeArea = causeAreas.find((area) => area.id === selectedCauseAreaId);
      if (!causeArea) return [];

      return causeArea.organizations.filter((org) => org.isActive);
    };

    // Get selected cause area name (for display)
    const getSelectedCauseAreaName = () => {
      if (!selectedCauseAreaId) return "";
      const causeArea = causeAreas.find((area) => area.id === selectedCauseAreaId);
      return causeArea ? causeArea.name : "";
    };

    // Get selected organization name (for display)
    const getSelectedOrganizationName = () => {
      if (!selectedCauseAreaId || !selectedOrganizationId) return "";

      const causeArea = causeAreas.find((area) => area.id === selectedCauseAreaId);
      if (!causeArea) return "";

      const org = causeArea.organizations.find((org) => org.id === selectedOrganizationId);
      return org ? org.widgetDisplayName || org.name : "";
    };

    if (loading) return <Text>Loading data...</Text>;
    if (error) return <Text>{error}</Text>;

    return (
      <div ref={ref}>
        <Stack space={4}>
          <Card
            padding={3}
            radius={2}
            tone={!selectedCauseAreaId || !selectedOrganizationId ? "critical" : undefined}
            border
          >
            <Stack space={3}>
              {/* Cause Area Selection */}
              <Flex align="center">
                <Box flex={1}>
                  <Label htmlFor="cause-area-select">Cause Area</Label>
                </Box>
                <Box flex={1}>
                  <Select
                    id="cause-area-select"
                    onChange={handleCauseAreaChange}
                    value={selectedCauseAreaId?.toString() || ""}
                  >
                    <option value="">Select a cause area</option>
                    {causeAreas.map((area) => (
                      <option key={area.id} value={area.id.toString()}>
                        {area.name}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Flex>

              {/* Organization Selection (only shown if cause area is selected) */}
              {selectedCauseAreaId && (
                <Flex align="center">
                  <Box flex={1}>
                    <Label htmlFor="organization-select">Organization</Label>
                  </Box>
                  <Box flex={1}>
                    <Select
                      id="organization-select"
                      onChange={handleOrganizationChange}
                      value={selectedOrganizationId?.toString() || ""}
                    >
                      <option value="">Select an organization</option>
                      {getAvailableOrganizations().map((org) => (
                        <option key={org.id} value={org.id.toString()}>
                          {org.widgetDisplayName || org.name}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Flex>
              )}
            </Stack>
          </Card>
        </Stack>
      </div>
    );
  },
);
