import React, { useEffect, useState } from 'react';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';
import { useParams } from 'react-router-dom';
import '../../../styles/Global/Global.scss';
import '../../../styles/Global/Variable.scss';

const AccountViewHeader = () => {
  const { id, account_id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    getAccountData(account_id ?? id);
  }, [id, account_id]);

  const getAccountData = async (account_id) => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/accounts/${account_id}`
    );
    const { data } = await result.json();
    setAccountData(data);
  };

  return (
    <div className="d-flex flex-column">
      <h4 className="">{accountData?.name || ''}</h4>
      <span>
        {accountData?.address?.city || ''}, {accountData?.address?.state || ''}
      </span>
    </div>
  );
};

export default AccountViewHeader;
