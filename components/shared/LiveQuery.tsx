import dynamic from "next/dynamic";
import type LiveQueryData from "./LiveQueryData";

/**
 * Live-updating data for draft mode. Only render it when `draftMode` is set, so
 * @sanity/preview-kit is only loaded for editors and never for ordinary visitors.
 */
export const LiveQuery = dynamic(() => import("./LiveQueryData")) as typeof LiveQueryData;
