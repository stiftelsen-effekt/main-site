import React, { useState, useEffect } from "react";
import { StringInputProps, set, unset, StringSchemaType } from "sanity";
import { Card, Select, Stack, Text, Spinner, Button } from "@sanity/ui";

interface ApiResponse {
  status: number;
  content: Array<{
    output: string;
    total: any;
    monthly: any[];
  }>;
}

interface ApiSchemaType extends StringSchemaType {
  options?: StringSchemaType["options"] & {
    apiUrl?: string;
  };
}

interface ApiOutputSelectorProps extends Omit<StringInputProps, "schemaType"> {
  schemaType: ApiSchemaType;
}

const api = process.env.SANITY_STUDIO_EFFEKT_API_URL;

export default function ApiOutputSelector(props: ApiOutputSelectorProps) {
  const { onChange, value, schemaType } = props;
  const [outputs, setOutputs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const fetchOutputs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${api}/results/donations/monthly/outputs`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      // Extract output names from the API response
      const outputNames = data.content.map((item) => item.output);
      setOutputs(outputNames);
      setFetched(true);
    } catch (err) {
      console.error("Failed to fetch outputs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-fetch on component mount
    fetchOutputs();
  }, []);

  const handleChange = (selectedOutput: string) => {
    if (selectedOutput) {
      onChange(set(selectedOutput));
    } else {
      onChange(unset());
    }
  };

  return (
    <Stack space={3}>
      {error && (
        <Card padding={2} radius={1} tone="critical">
          <Text size={1}>Error: {error}</Text>
        </Card>
      )}

      <Stack space={2}>
        {loading && (
          <Card padding={2} radius={1}>
            <Stack space={2}>
              <Spinner />
              <Text size={1}>Loading outputs from API...</Text>
            </Stack>
          </Card>
        )}

        {outputs.length > 0 && (
          <Select
            value={value || ""}
            onChange={(event) => handleChange(event.currentTarget.value)}
            placeholder="Select an output type"
          >
            <option value="">Select output...</option>
            {outputs.map((output) => (
              <option key={output} value={output}>
                {output}
              </option>
            ))}
          </Select>
        )}

        {fetched && outputs.length === 0 && !loading && (
          <Card padding={2} radius={1} tone="caution">
            <Text size={1}>No outputs found in API response</Text>
          </Card>
        )}
      </Stack>
    </Stack>
  );
}
