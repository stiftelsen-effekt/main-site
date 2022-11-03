import { useState } from "react";
import { Edit2, Trash2 } from "react-feather";
import { TaxUnit } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import { TaxUnitDeleteModal } from "../../TaxUnitModal/TaxUnitDeleteModal";
import { TaxUnitEditModal } from "../../TaxUnitModal/TaxUnitEditModal";
import { GenericList, ListRow } from "../GenericList";

export const TaxUnitList: React.FC<{
  taxUnits: TaxUnit[];
}> = ({ taxUnits }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

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
  const suplementalInformation =
    currentYearDeductions && currentYearDeductions.taxDeduction > 0 ? (
      <span>
        {`I år kvalifiserer donasjoner på denne enheten deg til `}
        <span style={{ whiteSpace: "nowrap" }}>
          {thousandize(Math.round(currentYearDeductions.taxDeduction))}
        </span>{" "}
        kroner i skattefradrag
      </span>
    ) : (
      ``
    );

  const rows: ListRow[] = [
    {
      id: unit.id.toString(),
      defaultExpanded: false,
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
            setEditModalOpen(true);
            break;
          case "Slett":
            setDeleteModalOpen(true);
            break;
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
      {editModalOpen && (
        <TaxUnitEditModal
          open={editModalOpen}
          initial={unit}
          onClose={() => setEditModalOpen(false)}
          onSuccess={() => setEditModalOpen(false)}
          onFailure={() => {}}
        />
      )}
      {deleteModalOpen && (
        <TaxUnitDeleteModal
          open={deleteModalOpen}
          taxUnit={unit}
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
