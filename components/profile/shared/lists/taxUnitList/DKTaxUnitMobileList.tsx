import { useState } from "react";
import { Edit2 } from "react-feather";
import type { TaxUnit } from "../../../../../models";
import { TaxUnitEditModal } from "../../TaxUnitModal/TaxUnitEditModal";
import { GenericList } from "../GenericList";
import type { ListRow } from "../GenericListRow";
import { TaxUnitMobileDetails } from "./TaxUnitMobileDetails";

export const DKTaxUnitMobileList: React.FC<{
  taxUnits: TaxUnit[];
}> = ({ taxUnits }) => {
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

  const rows: ListRow<TaxUnit>[] = taxUnits.map((unit) => {
    const contextOptions = [{ label: "Rediger", icon: <Edit2 size={16} /> }];

    return {
      id: unit.id.toString(),
      defaultExpanded: false,
      cells: [{ value: unit.name }, { value: unit.ssn }],
      contextOptions,
      onContextSelect: (option: string, element: TaxUnit) => {
        if (option === "Rediger") {
          setEditModalOpen(true);
          setSelectedTaxUnit(element);
        }
      },
      details: <TaxUnitMobileDetails taxUnit={unit} />,
      element: unit,
    };
  });

  const emptyPlaceholder = (
    <div>
      <div>Der mangler information for skatteenheden.</div>
      <div>
        Kontakt os på <a href={"mailto: donasjon@giveffektivt.dk"}>donasjon@giveffektivt.dk</a>.
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
    </>
  );
};
