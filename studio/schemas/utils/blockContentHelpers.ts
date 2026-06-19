import { blocktype } from "../types/blockcontent";

type BlockType = typeof blocktype;
type AnnotationType = typeof blocktype.marks.annotations[number];

/**
 * Creates a filtered version of the blocktype with specified annotations removed
 * @param annotationsToRemove - Array of annotation names to remove (e.g., ['citation'])
 * @returns A new blocktype object with filtered annotations
 */
export function createFilteredBlockType(annotationsToRemove: string[]): BlockType {
  return {
    ...blocktype,
    marks: {
      ...blocktype.marks,
      annotations: blocktype.marks.annotations.filter(
        (annotation) => !annotationsToRemove.includes(annotation.name),
      ),
    },
  };
}

/**
 * Creates a filtered version of the blocktype with only specified annotations kept
 * @param annotationsToKeep - Array of annotation names to keep (e.g., ['link', 'navitem'])
 * @returns A new blocktype object with only the specified annotations
 */
export function createBlockTypeWithOnly(annotationsToKeep: string[]): BlockType {
  return {
    ...blocktype,
    marks: {
      ...blocktype.marks,
      annotations: blocktype.marks.annotations.filter((annotation) =>
        annotationsToKeep.includes(annotation.name),
      ),
    },
  };
}

/**
 * Common presets for block content configurations
 */
export const BlockTypePresets = {
  /** Block type without citation annotations */
  withoutCitations: createFilteredBlockType(["citation"]),

  /** Block type with only link annotations */
  linksOnly: createBlockTypeWithOnly(["link", "navitem"]),

  /** Block type with no annotations at all */
  plainText: {
    ...blocktype,
    marks: {
      ...blocktype.marks,
      annotations: [],
    },
  },
} as const;
