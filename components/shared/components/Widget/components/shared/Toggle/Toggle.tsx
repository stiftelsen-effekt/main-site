import { StyledToggle, StyledToggleCircle } from "./Toggle.style";

export const Toggle: React.FC<{
  active: boolean;
  onChange: (active: boolean) => void;
  dataCy?: string;
}> = ({ active, onChange, dataCy }) => {
  return (
    <StyledToggle
      onClick={(e) => {
        e.currentTarget.blur();
        onChange(!active);
      }}
      active={active}
      data-cy={dataCy}
    >
      <StyledToggleCircle active={active} />
    </StyledToggle>
  );
};
