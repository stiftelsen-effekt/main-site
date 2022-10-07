import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Validator from "validator";
import { setShares } from "../../../store/donation/actions";
import { State } from "../../../store/state";
import { TextInput } from "../../shared/Input/TextInput";
import { ShareContainer, ShareInputContainer, ShareLink } from "./ShareSelection.style";

export const SharesSelection: React.FC = () => {
  const dispatch = useDispatch();
  const organizations = useSelector((state: State) => state.layout.organizations);
  const shareState = useSelector((state: State) => state.donation.shares);

  if (!organizations) return <div>Ingen organisasjoner</div>;

  return (
    <ShareContainer>
      {shareState.map((share) => (
        <ShareInputContainer key={share.id}>
          <ShareLink
            href={
              organizations.filter((org) => org.id === share.id)[0].id === 12
                ? "https://gieffektivt.no/smart-fordeling"
                : `https://gieffektivt.no/organizations/#${organizations
                    .filter((org) => org.id === share.id)[0]
                    .name.replace(/ /g, "_")}`
            }
          >
            <label htmlFor={share.id.toString()}>
              {organizations.filter((org) => org.id === share.id)[0].name}
            </label>
          </ShareLink>
          <input
            data-cy={`org-${share.id}`}
            name={share.id.toString()}
            placeholder="0"
            value={share.split.toString()}
            onChange={(e) => {
              const newShareState = [...shareState];
              const index = newShareState.map((s) => s.id).indexOf(share.id);

              if (e.target.value === "") {
                newShareState[index].split = 0;
              } else if (Validator.isInt(e.target.value)) {
                const newSplit = parseInt(e.target.value);
                if (newSplit <= 100 && newSplit >= 0) {
                  newShareState[index].split = newSplit;
                }
              }

              dispatch(setShares(newShareState));
            }}
          />
        </ShareInputContainer>
      ))}
    </ShareContainer>
  );
};
