import React, { useEffect, useMemo, useState } from "react";
import { Box, Card, Checkbox, Flex, Select, Spinner, Stack, Text } from "@sanity/ui";
import { NumberInputProps, ArrayOfPrimitivesInputProps, set, unset, useFormValue } from "sanity";

/**
 * Inputs for picking cause areas by name instead of typing raw numeric IDs.
 *
 * Cause area IDs are assigned per platform (they differ between Gi/Giv/Ge Effektivt),
 * so hardcoding or hand-typing them is error-prone - e.g. the operations cause area is
 * 4 in Sweden but doesn't exist at all in Norway or Denmark. These components read the
 * live list from the platform's own API so the editor always sees real options.
 *
 * If the API can't be reached the inputs fall back to plain numeric entry so editors
 * are never blocked by an API outage.
 */

type Organization = {
  id: number;
  name: string;
  isActive: boolean;
};

type CauseArea = {
  id: number;
  name: string;
  isActive: boolean;
  organizations: Organization[];
};

/** Sentinel used by cause_area_contexts to attach copy to the smart/recommended option. */
const SMART_DISTRIBUTION_ID = -1;

const api = process.env.SANITY_STUDIO_EFFEKT_API_URL;

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; causeAreas: CauseArea[] };

let cache: CauseArea[] | null = null;

const useCauseAreas = (): FetchState => {
  const [state, setState] = useState<FetchState>(
    cache ? { status: "ready", causeAreas: cache } : { status: "loading" },
  );

  useEffect(() => {
    if (cache) return;

    let cancelled = false;
    fetch(`${api}/causeareas/all`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        const causeAreas: CauseArea[] = data?.content ?? [];
        cache = causeAreas;
        setState({ status: "ready", causeAreas });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error fetching cause areas:", err);
        setState({ status: "error", message: "Could not load cause areas from the API" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};

const labelFor = (causeArea: CauseArea) =>
  `${causeArea.name} (ID ${causeArea.id})${causeArea.isActive ? "" : " — inactive"}`;

const organizationLabelFor = (organization: Organization) =>
  `${organization.name} (ID ${organization.id})${organization.isActive ? "" : " — inactive"}`;

/**
 * Single cause area picker. Use for number fields holding one cause area ID.
 * Set `options.includeSmartDistribution` on the field to offer the smart/recommended
 * pseudo cause area as well.
 */
export const CauseAreaSelectInput = (props: NumberInputProps) => {
  const { value, onChange, schemaType, elementProps } = props;
  const state = useCauseAreas();

  const includeSmartDistribution = Boolean(
    (schemaType.options as { includeSmartDistribution?: boolean } | undefined)
      ?.includeSmartDistribution,
  );

  if (state.status === "loading") {
    return (
      <Flex align="center" gap={2}>
        <Spinner muted />
        <Text muted size={1}>
          Loading cause areas…
        </Text>
      </Flex>
    );
  }

  if (state.status === "error") {
    return (
      <Stack space={2}>
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>{state.message}. Enter the cause area ID manually.</Text>
        </Card>
        {props.renderDefault(props)}
      </Stack>
    );
  }

  const knownIds = state.causeAreas.map((area) => area.id);
  const hasUnknownValue =
    typeof value === "number" && value !== SMART_DISTRIBUTION_ID && !knownIds.includes(value);

  return (
    <Stack space={2}>
      <Select
        {...elementProps}
        value={value === undefined || value === null ? "" : String(value)}
        onChange={(event) => {
          const raw = event.currentTarget.value;
          onChange(raw === "" ? unset() : set(Number(raw)));
        }}
      >
        <option value="">Not set</option>
        {includeSmartDistribution && (
          <option value={String(SMART_DISTRIBUTION_ID)}>
            Smart distribution / recommendation (ID {SMART_DISTRIBUTION_ID})
          </option>
        )}
        {state.causeAreas.map((area) => (
          <option key={area.id} value={String(area.id)}>
            {labelFor(area)}
          </option>
        ))}
        {hasUnknownValue && <option value={String(value)}>Unknown cause area (ID {value})</option>}
      </Select>
      {hasUnknownValue && (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>
            ID {value} is not a cause area on this platform&apos;s API. It may belong to a different
            platform.
          </Text>
        </Card>
      )}
    </Stack>
  );
};

export const OrganizationSelectInput = (props: NumberInputProps) => {
  const { value, onChange, elementProps, path, schemaType } = props;
  const state = useCauseAreas();
  const causeAreaField =
    (schemaType.options as { causeAreaField?: string } | undefined)?.causeAreaField ??
    "cause_area_id";
  const causeAreaId = useFormValue([...path.slice(0, -1), causeAreaField]);

  if (state.status === "loading") {
    return (
      <Flex align="center" gap={2}>
        <Spinner muted />
        <Text muted size={1}>
          Loading organizations…
        </Text>
      </Flex>
    );
  }

  if (state.status === "error") {
    return (
      <Stack space={2}>
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>{state.message}. Enter the organization ID manually.</Text>
        </Card>
        {props.renderDefault(props)}
      </Stack>
    );
  }

  const selectedCauseArea = state.causeAreas.find((area) => area.id === causeAreaId);
  const organizations = selectedCauseArea?.organizations ?? [];
  const allOrganizations = state.causeAreas.flatMap((area) => area.organizations);
  const currentOrganization = allOrganizations.find((organization) => organization.id === value);
  const hasUnavailableValue =
    typeof value === "number" && !organizations.some((organization) => organization.id === value);

  return (
    <Stack space={2}>
      <Select
        {...elementProps}
        value={value === undefined || value === null ? "" : String(value)}
        onChange={(event) => {
          const raw = event.currentTarget.value;
          onChange(raw === "" ? unset() : set(Number(raw)));
        }}
      >
        <option value="">Not set</option>
        {organizations.map((organization) => (
          <option key={organization.id} value={String(organization.id)}>
            {organizationLabelFor(organization)}
          </option>
        ))}
        {hasUnavailableValue && (
          <option value={String(value)}>
            {currentOrganization
              ? organizationLabelFor(currentOrganization)
              : `Unknown organization (ID ${value})`}
          </option>
        )}
      </Select>
      {!selectedCauseArea && (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>Select a cause area to load its organizations.</Text>
        </Card>
      )}
      {selectedCauseArea && hasUnavailableValue && (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>
            Organization ID {value} is not available in {selectedCauseArea.name}. The saved value
            has been retained.
          </Text>
        </Card>
      )}
    </Stack>
  );
};

/**
 * Multi cause area picker. Use for array-of-number fields holding several cause area IDs.
 */
export const CauseAreaMultiSelectInput = (props: ArrayOfPrimitivesInputProps<number>) => {
  const { value, onChange } = props;
  const state = useCauseAreas();

  const selected = useMemo(() => new Set(value ?? []), [value]);

  if (state.status === "loading") {
    return (
      <Flex align="center" gap={2}>
        <Spinner muted />
        <Text muted size={1}>
          Loading cause areas…
        </Text>
      </Flex>
    );
  }

  if (state.status === "error") {
    return (
      <Stack space={2}>
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>{state.message}. Enter cause area IDs manually.</Text>
        </Card>
        {props.renderDefault(props)}
      </Stack>
    );
  }

  const toggle = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    const ids = Array.from(next).sort((a, b) => a - b);
    onChange(ids.length ? set(ids) : unset());
  };

  const knownIds = state.causeAreas.map((area) => area.id);
  const unknownSelected = (value ?? []).filter((id) => !knownIds.includes(id));

  return (
    <Stack space={2}>
      {state.causeAreas.map((area) => (
        <Flex key={area.id} align="center" gap={2}>
          <Checkbox
            id={`cause-area-${area.id}`}
            checked={selected.has(area.id)}
            onChange={() => toggle(area.id)}
          />
          <Box>
            <Text as="label" htmlFor={`cause-area-${area.id}`} size={1}>
              {labelFor(area)}
            </Text>
          </Box>
        </Flex>
      ))}
      {unknownSelected.length > 0 && (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>
            Also selected, but not cause areas on this platform&apos;s API:{" "}
            {unknownSelected.join(", ")}. They may belong to a different platform.
          </Text>
        </Card>
      )}
    </Stack>
  );
};
