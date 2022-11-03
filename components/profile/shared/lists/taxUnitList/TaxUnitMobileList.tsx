import { useState } from "react";
import { Edit2, Trash2 } from "react-feather";
import { TaxUnit } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import { TaxUnitDeleteModal } from "../../TaxUnitModal/TaxUnitDeleteModal";
import { TaxUnitEditModal } from "../../TaxUnitModal/TaxUnitEditModal";
import { GenericList, ListRow } from "../GenericList";
import { TaxUnitMobileDetails } from "./TaxUnitMobileDetails";

export const TaxUnitMobileList: React.FC<{
  taxUnits: TaxUnit[];
}> = ({ taxUnits }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const unit = taxUnits[0];

  const ssnType = unit.ssn.length === 11 ? "birthnr" : "orgnr";
  const headers = [
    {
      label: "Navn",
      width: "60%",
    },
    {
      label: ssnType === "birthnr" ? "Fødselsnummer" : "Organisasjonsnummer",
      width: "40%",
    },
  ];

  const rows: ListRow[] = taxUnits.map((unit) => ({
    id: unit.id.toString(),
    defaultExpanded: false,
    cells: [unit.name, unit.ssn],
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
    details: <TaxUnitMobileDetails taxUnit={unit} />,
  }));

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
        headers={headers}
        rows={rows}
        emptyPlaceholder={emptyPlaceholder}
        expandable={true}
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
