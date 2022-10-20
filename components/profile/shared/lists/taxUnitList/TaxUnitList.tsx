import { Edit, Edit2, Trash, Trash2 } from "react-feather";
import { Distribution, Donation, META_OWNER, TaxUnit } from "../../../../../models";
import { shortDate, thousandize } from "../../../../../util/formatting";
import { GenericList, ListRow } from "../GenericList";

export const TaxUnitList: React.FC<{
  taxUnits: TaxUnit[];
}> = ({ taxUnits }) => {
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

  const rows: ListRow[] = [
    {
      id: unit.id.toString(),
      cells: [
        unit.ssn,
        thousandize(Math.round(unit.numDonations)),
        thousandize(Math.round(unit.sumDonations)) + " kr",
        "TODO",
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
        alert(option);
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
    <GenericList
      title={unit.name}
      headers={headers}
      rows={rows}
      emptyPlaceholder={emptyPlaceholder}
      expandable={false}
    />
  );
};
