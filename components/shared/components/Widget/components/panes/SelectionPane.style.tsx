import styled from "styled-components";

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-start;
  flex-direction: column;
`;

export const CauseAreaButton = styled.button`
  background: var(--secondary);
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 20px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  min-height: 72px;

  &:hover {
    background: var(--primary);
    color: var(--secondary);

    > div {
      filter: var(--cause-area-icon-filter-hover, invert(0));
    }

    &::after {
      transform: translateX(5px);
    }
  }

  &::after {
    /* Right arrow */
    content: "→";
    font-size: 20px;
    margin-left: auto;
    transition: transform 0.2s ease-out;
  }
`;

export const CauseAreaIcon = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  display: inline-flex;
  background-size: contain;
  background-repeat: no-repeat;
  border: none;
  filter: var(--cause-area-icon-filter, invert(0));
}`;

export const CauseAreaButtonsDividerLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--primary);
  margin: 40px 0;
`;

export const getCauseAreaIconById = (id: number) => {
  switch (id) {
    case 1:
      return <GlobalHealthIcon />;
    case 2:
      return <AnimalWelfareIcon />;
    case 3:
      return <FutureGenerationsIcon />;
    case 4:
      return <OperationsIcon />;
    case 5:
      return <OtherIcon />;
    default:
      return <CauseAreaIcon />;
  }
};

export const GlobalHealthIcon = styled(CauseAreaIcon)`
  background-image: url("/images/cause-areas/global-health.png");
`;

export const FutureGenerationsIcon = styled(CauseAreaIcon)`
  background-image: url("/images/cause-areas/future-generations.png");
`;

export const AnimalWelfareIcon = styled(CauseAreaIcon)`
  background-image: url("/images/cause-areas/animal-welfare.png");
`;

export const OtherIcon = styled(CauseAreaIcon)`
  background-image: url("/images/cause-areas/other.png");
`;

export const OperationsIcon = styled(CauseAreaIcon)`
  background-image: url("/images/cause-areas/operations.png");
`;

export const MultipleCauseAreaIcon = styled(CauseAreaIcon)`
  background-image: url("/images/cause-areas/multiple-cause-area.png");
`;
