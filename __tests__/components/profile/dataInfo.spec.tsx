import { render } from "@testing-library/react";
import { DataInfo } from "../../../components/profile/dataInfo";
const testData= [
  {
    "data": [
      {
        "_key": "a766296a1d9d",
        "_type": "block",
        "children": [
          {
            "_key": "a2a05e4020640",
            "_type": "span",
            "marks": [],
            "text": "DATA POLICY AVSNITT"
          }
        ],
        "markDefs": [],
        "style": "normal"
      }
    ],
    "tax": [
      {
        "_key": "6cd4bdab1e5a",
        "_type": "block",
        "children": [
          {
            "_key": "f9e718af6bcd0",
            "_type": "span",
            "marks": [],
            "text": "SKATTEFRADRAG AVSNITT"
          }
        ],
        "markDefs": [],
        "style": "normal"
      }
    ]
  }
];

it('Displays the tax deduction text', () => {
  const {queryByText} = render(
    <DataInfo data={testData} />,
  );

  expect(queryByText(/SKATTEFRADRAG AVSNITT/i)).toBeTruthy();
})


it('Displays the data policy text', () => {
  const {queryByText} = render(
    <DataInfo data={testData} />,
  );

  expect(queryByText(/DATA POLICY AVSNITT/i)).toBeTruthy();
})
