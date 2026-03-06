import { useState } from "react";
import { Edit2 } from "react-feather";
import { TaxUnit } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import { TaxUnitEditModal } from "../../TaxUnitModal/TaxUnitEditModal";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";

export const DKTaxUnitList: React.FC<{
  taxUnits: TaxUnit[];
}> = ({ taxUnits }) => {
  const currentYear = new Date().getFullYear();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTaxUnit, setSelectedTaxUnit] = useState<TaxUnit | null>(null);

  const unit = taxUnits[0];

  const suplementalInformation =
    unit.ssn.length === 10
      ? unit.ssn.replace(/(\d{6})(\d{4})/, "$1-$2")
      : unit.ssn.replace(/(\d{4})(\d{4})/, "$1 $2");

  const headers = [
    {
      label: "",
      width: "10%",
    },
    {
      label: "Sum af donationer",
      width: "30%",
    },
    {
      label: "Sum af skattefradrag",
      width: "30%",
    },
    {
      label: "Sum af skattefordel",
      width: "30%",
    },
  ];

  const filteredDeductions = unit.taxDeductions?.filter((d) => d.sumDonations > 0) || [];

  const contextOptions = [{ label: "Rediger", icon: <Edit2 size={16} /> }];

  const context = {
    contextOptions,
    onContextSelect: (option: string, element: TaxUnit) => {
      if (option === "Rediger") {
        setSelectedTaxUnit(element);
        setEditModalOpen(true);
      }
    },
  };

  const rows: ListRow<TaxUnit>[] = filteredDeductions.map((deductions) => {
    const row = {
      id: `${unit.id.toString()}${deductions.year}`,
      defaultExpanded: false,
      cells: [
        { value: deductions.year.toString() },
        { value: thousandize(Math.round(deductions.sumDonations)) + " kr" },
        { value: thousandize(Math.round(deductions.deduction)) + " kr" },
        { value: thousandize(Math.round(deductions.benefit)) + " kr" },
      ],
      element: unit,
    };

    if (deductions.year === currentYear) {
      return { ...row, ...context };
    }
    return row;
  });

  const totalsRow = {
    id: `${unit.id.toString()}total`,
    defaultExpanded: false,
    cells: [
      { value: "Totalt" },
      {
        value:
          thousandize(
            Math.round(filteredDeductions.reduce((acc, cur) => acc + cur.sumDonations, 0)),
          ) + " kr",
      },
      {
        value:
          thousandize(Math.round(filteredDeductions.reduce((acc, cur) => acc + cur.deduction, 0))) +
          " kr",
      },
      {
        value:
          thousandize(Math.round(filteredDeductions.reduce((acc, cur) => acc + cur.benefit, 0))) +
          " kr",
      },
    ],
    element: unit,
  };

  rows.push(totalsRow);

  const emptyPlaceholder = (
    <div>
      <div>Der mangler information for skatteenheden.</div>
      <div>
        Kontakt os på <a href={"mailto: donation@giveffektivt.dk"}>donation@giveffektivt.dk</a>.
      </div>
    </div>
  );

  return (
    <>
      <GenericList
        title={unit.name}
        supplementalInformation={suplementalInformation}
        headers={headers}
        rows={rows}
        emptyPlaceholder={emptyPlaceholder}
        expandable={false}
        proportions={[30, 60]}
      />
      {editModalOpen && selectedTaxUnit && (
        <TaxUnitEditModal
          open={editModalOpen}
          initial={selectedTaxUnit}
          onClose={() => setEditModalOpen(false)}
          onSuccess={() => setEditModalOpen(false)}
          onFailure={() => {}}
        />
      )}
    </>
  );
};
