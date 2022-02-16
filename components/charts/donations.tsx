import React, { PureComponent } from "react"
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, XAxis } from "recharts"

const DonationsChart: React.FC<{data: any[]}> = ({data}) => {
  const organizations = getOrganizationsFromData(data)

  return (<ResponsiveContainer>
    <BarChart 
      data={data}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      barSize={90}
      barGap={0}>
      <XAxis 
        dataKey={"name"}
        stroke={"white"}
        padding={{left: 0}}>
      </XAxis>
      {
        organizations.map((org: string, i: number) => (
          <Bar 
            dataKey={org} 
            stackId={"a"} 
            fill={"#ffffff"} 
            key={i}
            spacing={100}
            shape={(props) => barWithBorder(props, 1, "black")}
            isAnimationActive={false}>
            <LabelList 
              dataKey={org} 
              position={"right"} 
              fill={"#ffffff"}
              content={(props) => chartLabel(props, org)}/>
          </Bar>
        ))
      }
    </BarChart>
  </ResponsiveContainer>)
}

const chartLabel: React.FC<any> = (props, org) => {
  const { x, y, width, height, value } = props

  if (!value) return <></>

  return (
    <foreignObject
      width={200}
      height={height}
      transform={`translate(${x + width}, ${y})`}>
      <div style={{ 
        color: "white", 
        height: "100%", 
        display: "flex", 
        justifyContent: "flex-end", 
        flexDirection: "column",
        paddingBottom: 4,
        paddingLeft: 10 }}>
        <div style={{ fontSize: 12 }}>{org}</div>
        <div style={{ fontSize: 10 }}>{value}</div>
      </div>
    </foreignObject>
  )
}

class CustomizedAxisTick extends PureComponent<any> {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
          {payload.value}
        </text>
      </g>
    );
  }
}

const barWithBorder = (props: any, borderHeight: number, borderColor: string) => {
  const { fill, x, y, width, height } = props
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} stroke="none" fill={fill} />
      <rect x={x} y={y} width={width} height={borderHeight} stroke="none" fill={borderColor} />
    </g>
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
  let orgs: string[] = []
  data.reduce((pre, cur) => {
    const keys = Object.keys(cur)
    if (keys.length > pre) {
      orgs = keys
      return keys.length
    } else {
      return pre
    }
  }, 0)
  // Filter out the name key, this is used as the x axis determinant
  orgs = orgs.filter(org => org != "name")
  return orgs
}

export default DonationsChart