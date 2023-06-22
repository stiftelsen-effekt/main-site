import { StyledToggle, StyledToggleCircle } from "./Toggle.style";

export const Toggle: React.FC<{ active: boolean; onChange: (active: boolean) => void }> = ({
  active,
  onChange,
}) => {
  return (
    <StyledToggle onClick={() => onChange(!active)} active={active}>
      <StyledToggleCircle active={active} />
    </StyledToggle>
  );
};
