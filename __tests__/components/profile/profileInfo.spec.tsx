import { render } from "@testing-library/react";
import { ProfileInfo } from "../../../components/profile/profileInfo";
import {useApi} from "../../../hooks/useApi";

jest.mock("../../../hooks/useApi")


it('Displays loading when fetching donor', () => {
  (useApi as any).mockReturnValue({
    loading: true,
    data: null,
    error: null
  })

  const {queryByText} = render(
    <ProfileInfo />,
  );

  expect(queryByText(/Loading/i)).toBeTruthy();
})


it('Displays donor data when loaded', () => {
    (useApi as any).mockReturnValue({
      loading: false,
      data: {
        email: "anniken.hoff@hotmail.com",
        id: 2348,
        name: "Anniken Hoff",
        newsletter: 0,
        registered: "2022-02-07T11:24:01.000Z",
        ssn: null,
        trash: null
      },
      error: null
    })

    const {queryByText} = render(
        <ProfileInfo />,
      );
    
      expect(queryByText(/Anniken/i)).toBeTruthy();
})


