import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '../hooks/useApi';
import { Donation } from '../models';
import { shortDate } from '../util/formatting';

const Donations = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [donations, setDonations] = useState<null | Donation[]>(null);

  useApi<Donation[]>(
    `/donors/${user ? user["https://konduit.no/user-id"] : ""}/donations`, 
    'read:donations', 
    getAccessTokenSilently, 
    (res) => {
      setDonations(res)
    }
  )

  if (!donations) {
    return <div>Loading...</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Dato</th>
          <th>Sum</th>
          <th>Betalingskanal</th>
        </tr>
      </thead>
      <tbody>
        {donations.map((donation) => {
          return <tr key={donation.id}>
            <td>{shortDate(donation.timestamp)}</td>
            <td>{donation.sum}</td>
            <td>{donation.paymentMethod}</td>
            </tr>;
        })}
      </tbody>
    </table>
  );
};

export default Donations;