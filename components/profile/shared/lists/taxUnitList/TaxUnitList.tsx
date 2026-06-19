import { useState } from "react";
import { Edit2, Trash2 } from "react-feather";
import { TaxUnit } from "../../../../../models";
import { useMainLocale } from "../../../../../context/MainLocaleContext";
import { thousandize } from "../../../../../util/formatting";
import { TaxUnitDeleteModal } from "../../TaxUnitModal/TaxUnitDeleteModal";
import { TaxUnitEditModal } from "../../TaxUnitModal/TaxUnitEditModal";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { DKTaxUnitList } from "./DKTaxUnitList";

interface TaxUnitListLabels {
  sumDonationsLabel: string;
  sumTaxDeductionsLabel: string;
  sumTaxBenefitLabel: string;
}

const TaxUnitListStandard: React.FC<{ taxUnits: TaxUnit[] } & TaxUnitListLabels> = ({
  taxUnits,
  sumDonationsLabel,
  sumTaxDeductionsLabel,
  sumTaxBenefitLabel,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTaxUnit, setSelectedTaxUnit] = useState<TaxUnit | null>(null);

  const unit = taxUnits[0];

  const suplementalInformation =
    unit.ssn.length === 11
      ? unit.ssn.replace(/(\d{6})(\d{5})/, "$1 $2")
      : unit.ssn.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

  const headers = [
    {
      label: "",
      width: "10%",
    },
    {
      label: sumDonationsLabel,
      width: "30%",
    },
    {
      label: sumTaxDeductionsLabel,
      width: "30%",
    },
    {
      label: sumTaxBenefitLabel,
      width: "30%",
    },
  ];

  const filteredDeductions = unit.taxDeductions?.filter((d) => d.sumDonations > 0) || [];

  const contextOptions = [
    { label: "Endre", icon: <Edit2 size={16} /> },
    { label: "Slett", icon: <Trash2 size={16} /> },
  ];

  const context = {
    contextOptions,
    onContextSelect: (option: string, element: TaxUnit) => {
      switch (option) {
        case "Endre":
          setSelectedTaxUnit(element);
          setEditModalOpen(true);
          break;
        case "Slett":
          setSelectedTaxUnit(element);
          setDeleteModalOpen(true);
          break;
      }
    },
  };

  const rows: ListRow<TaxUnit>[] = filteredDeductions.map((deductions, i) => {
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

    if (i === 0) {
      return { ...row, ...context };
    }
    return row;
  });

  let totalsRow = {
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

  if (filteredDeductions.length === 0) {
    totalsRow = { ...totalsRow, ...context };
  }

  rows.push(totalsRow);

  const emptyPlaceholder = (
    <div>
      <div>Det mangler informasjon for skatteenheten.</div>
      <div>
        Ta kontakt på <a href={"mailto: donasjon@gieffektivt.no"}>donasjon@gieffektivt.no</a>.
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
      {deleteModalOpen && selectedTaxUnit && (
        <TaxUnitDeleteModal
          open={deleteModalOpen}
          taxUnit={selectedTaxUnit}
          onSuccess={(success: boolean) => {
            setDeleteModalOpen(success);
          }}
          onFailure={() => {}}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export const TaxUnitList: React.FC<
  {
    taxUnits: TaxUnit[];
  } & TaxUnitListLabels
> = ({ taxUnits, sumDonationsLabel, sumTaxDeductionsLabel, sumTaxBenefitLabel }) => {
  const mainLocale = useMainLocale();
  if (mainLocale === "dk") {
    return (
      <DKTaxUnitList
        taxUnits={taxUnits}
        sumDonationsLabel={sumDonationsLabel}
        sumTaxDeductionsLabel={sumTaxDeductionsLabel}
        sumTaxBenefitLabel={sumTaxBenefitLabel}
      />
    );
  }
  return (
    <TaxUnitListStandard
      taxUnits={taxUnits}
      sumDonationsLabel={sumDonationsLabel}
      sumTaxDeductionsLabel={sumTaxDeductionsLabel}
      sumTaxBenefitLabel={sumTaxBenefitLabel}
    />
  );
};
