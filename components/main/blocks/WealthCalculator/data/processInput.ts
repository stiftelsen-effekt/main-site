/**
 * This script processes the raw data files for the Wealth Mountain graph and generates a data.ts file
 *
 * The raw data is found in the github repo from gapminder:
 * https://github.com/open-numbers/ddf--worldbank--povcalnet/
 *
 * Specifically, we use:
 * - ddf--entities--income_bracket_50.csv
 * - income_mountain/ddf--datapoints--income_mountain_50bracket_shape_for_log--by--global--time.csv
 */

import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

interface DataPoint {
  x: number;
  y: number;
}

interface BracketDefinition {
  income_bracket_50: string;
  name: string;
}

interface PopulationData {
  global: string;
  time: string;
  income_mountain_50bracket_shape_for_log: string;
}

function processWealthMountainData(year: number): DataPoint[] {
  // Read and parse the bracket definitions
  const bracketsFile = fs.readFileSync(
    path.join(
      process.cwd(),
      "components/main/blocks/WealthCalculator/data/ddf--entities--income_bracket_50.csv",
    ),
    "utf-8",
  );
  const bracketDefinitions = parse(bracketsFile, {
    columns: true,
  }) as BracketDefinition[];

  // Read and parse the population data
  const populationFile = fs.readFileSync(
    path.join(
      process.cwd(),
      "components/main/blocks/WealthCalculator/data/ddf--datapoints--income_mountain_50bracket_shape_for_log--by--global--time.csv",
    ),
    "utf-8",
  );
  const populationData = parse(populationFile, {
    columns: true,
  }) as PopulationData[];

  // Find the population data for the specified year
  const yearData = populationData.find((row) => parseInt(row.time) === year);
  if (!yearData) {
    throw new Error(`Data for year ${year} not found`);
  }

  // Get population values for the year
  const populationValues = yearData.income_mountain_50bracket_shape_for_log.split(",").map(Number);

  // Generate data points
  const dataPoints: DataPoint[] = [];

  // Add the initial point at x=0
  dataPoints.push({ x: 0, y: 0 });

  // Process each bracket
  bracketDefinitions.forEach((bracket, index) => {
    const upperBound = parseFloat(bracket.name.split(" - ")[1]);
    dataPoints.push({
      x: upperBound,
      y: populationValues[index] || 0,
    });
  });

  return dataPoints;
}

// Generate the output file
function generateOutputFile(year: number): void {
  const dataPoints = processWealthMountainData(year);

  const output = formatDataPoints(dataPoints);

  fs.writeFileSync(
    path.join(process.cwd(), "components/main/blocks/WealthCalculator/data.ts"),
    output,
    "utf-8",
  );
}

function formatDataPoints(dataPoints: DataPoint[]): string {
  const formattedPoints = dataPoints
    .map((point) => `  { x: ${point.x}, y: ${point.y} }`)
    .join(",\n");

  return `export const wealthMountainGraphData = [\n${formattedPoints}\n];\n`;
}

// Example usage
const year = new Date().getFullYear();
generateOutputFile(year);

console.log(`Data for ${year} has been processed and saved to data.ts`);
