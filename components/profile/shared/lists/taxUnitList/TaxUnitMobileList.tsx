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
  const [selectedTaxUnit, setSelectedTaxUnit] = useState<TaxUnit | null>(null);

  const headers = [
    {
      label: "Navn",
    },
    {
      label: "Identifikator",
    },
  ];

  const rows: ListRow<TaxUnit>[] = taxUnits.map((unit) => ({
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
    onContextSelect: (option, element) => {
      switch (option) {
        case "Endre":
          setEditModalOpen(true);
          setSelectedTaxUnit(element);
          break;
        case "Slett":
          setSelectedTaxUnit(element);
          setDeleteModalOpen(true);
          break;
      }
    },
    details: <TaxUnitMobileDetails taxUnit={unit} />,
    element: unit,
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
        title={""}
        headers={headers}
        rows={rows}
        emptyPlaceholder={emptyPlaceholder}
        expandable={true}
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
            setDeleteModalOpen(false);
          }}
          onFailure={() => {}}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
};
