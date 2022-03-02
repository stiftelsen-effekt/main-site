import React from "react";
import style from "../../styles/DonationChart.module.css";
import { thousandize } from "../../util/formatting";

const DonationsChart: React.FC<{ data: any[] }> = ({ data }) => {
  const maxSum = getMaxYearSum(data);

  return (
    <div className={style.wrapper}>
      <div className={style["bars-wrapper"]}>
        {data.map((el) => {
          const constituents = getBarConstituents(el);
          const yearSum = getYearSum(el);
          return (
            <div
              className={style["bar-wrapper"]}
              style={{
                height: (yearSum / maxSum) * 100 + "%",
              }}
              key={el.name}
            >
              {constituents.map((constituent) => (
                <div
                  className={style.bar}
                  key={constituent.org}
                  style={{ height: (constituent.value / yearSum) * 100 + "%" }}
                ></div>
              ))}
            </div>
          );
        })}
      </div>
      <div className={style.axis}>
        {data.map((el) => {
          const yearSum = getYearSum(el);
          const year = el.name;

          return (
            <div className={style.label} key={year}>
              <div className={style.labelyear}>{year}</div>
              <div className={style.labelsum}>
                {thousandize(yearSum) + " kr"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Looks through all the keys on every data array element
 * Finds the one with the most keys and uses that to determine
 * all the organizations in the underlying data
 *
 * @param data An array of data points to be plotted in the bar chart
 * @returns A string array containing all the organizations
 */
const getOrganizationsFromData = (data: any[]): string[] => {
  let orgs: string[] = [];
  data.reduce((pre, cur) => {
    const keys = Object.keys(cur);
    if (keys.length > pre) {
      orgs = keys;
      return keys.length;
    } else {
      return pre;
    }
  }, 0);
  // Filter out the name key, this is used as the x axis determinant
  orgs = orgs.filter((org) => org != "name");
  return orgs;
};

const getMaxYearSum = (data: any[]): number => {
  const max = data.reduce((acc, el) => {
    const sum = getYearSum(el);
    if (sum > acc) {
      return sum;
    } else {
      return acc;
    }
  }, 0);
  return max;
};

const getYearSum = (data: any): number => {
  let sum = 0;
  for (const key in data) {
    if (key === "name") continue;

    sum += data[key];
  }

  return sum;
};

const getYears = (data: any[]) => {
  const years: any[] = [];
  data.forEach((el) => {
    years.push(el.name);
  });
  return years;
};

const getBarConstituents = (data: any) => {
  const constituents: { org: string; value: number }[] = [];
  for (const key in data) {
    if (key === "name") continue;

    constituents.push({
      org: key,
      value: data[key],
    });
  }
  return constituents;
};

export default DonationsChart;
