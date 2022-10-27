import { useState } from "react";
import { Edit, Edit2, Trash, Trash2 } from "react-feather";
import { Distribution, Donation, META_OWNER, TaxUnit } from "../../../../../models";
import { shortDate, thousandize } from "../../../../../util/formatting";
import { TaxUnitDeleteModal } from "../../TaxUnitModal/TaxUnitDeleteModal";
import { GenericList, ListRow } from "../GenericList";

export const TaxUnitList: React.FC<{
  taxUnits: TaxUnit[];
}> = ({ taxUnits }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const unit = taxUnits[0];

  const ssnType = unit.ssn.length === 11 ? "birthnr" : "orgnr";
  const headers = [
    {
      label: ssnType === "birthnr" ? "Fødselsnummer" : "Organisasjonsnummer",
      width: "25%",
    },
    {
      label: "Antall donasjoner",
      width: "25%",
    },
    {
      label: "Sum donasjoner",
      width: "25%",
    },
    {
      label: "Sum skattefradrag",
    },
  ];

  // If the tax unit has over 0 in tax deduction for current year
  // we should show the tax deduction for the current year
  const currentYearDeductions = unit.taxDeductions?.find(
    (td) => td.year === new Date().getFullYear(),
  );
  const suplementalInformation = currentYearDeductions
    ? `I 2022 er du kvalifiserft for ${thousandize(
        Math.round(currentYearDeductions.taxDeduction),
      )} kr i skattefradrag for denne enheten`
    : ``;

  const rows: ListRow[] = [
    {
      id: unit.id.toString(),
      cells: [
        unit.ssn,
        thousandize(Math.round(unit.numDonations)),
        thousandize(Math.round(unit.sumDonations)) + " kr",
        thousandize(
          Math.round(
            unit.taxDeductions
              ? unit.taxDeductions.reduce((acc, deduction) => acc + deduction.taxDeduction, 0)
              : 0,
          ),
        ) + " kr",
      ],
      contextOptions: [
        {
          label: "Endre",
          icon: <Edit2 size={16} />,
        },
        {
          label: "Slett",
          icon: <Trash2 size={16} />,
        },
      ],
      onContextSelect: (option) => {
        switch (option) {
          case "Endre":
            break;
          case "Slett":
            setDeleteModalOpen(true);
        }
      },
    },
  ];

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
      />
      {deleteModalOpen && (
        <TaxUnitDeleteModal
          open={deleteModalOpen}
          taxUnit={unit}
          onSuccess={function (unit: TaxUnit): void {
            setDeleteModalOpen(false);
          }}
          onFailure={function (): void {
            throw new Error("Function not implemented.");
          }}
          onClose={function (): void {
            setDeleteModalOpen(false);
          }}
        />
      )}
    </>
  );
};
