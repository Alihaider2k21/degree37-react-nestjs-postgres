import React, { useEffect, useState } from 'react';
import Notification from '../../assets/Vector.svg';
import Avatar from '../../assets/Avatar.png';
import jwt from 'jwt-decode';

export default function Topbar() {
  const [userData, setUserData] = useState({});
  const jwtToken = localStorage.getItem('token');
  const decodeToken = jwt(jwtToken);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        const result = await fetch(`${BASE_URL}/user/${id}`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });

        if (result?.status === 200) {
          let { data } = await result.json();
          setUserData({ ...data, role: data?.role?.name });
        }
      }
    };
    if (decodeToken?.id) {
      getData(decodeToken?.id);
    }
  }, []);
  return (
    <>
      <div className="topbar">
        <div className="px-0 container-fluid">
          <div className="row mx-0">
            <div className="col-12 px-0">
              <div
                className="d-flex align-items-center justify-content-end"
                style={{ height: '96px' }}
              >
                <img src={Notification} className="" alt="" />
                <img src={Avatar} className="me-2 ms-4" alt="" />
                <p className="top-bar-text mb-0">{`${
                  userData?.first_name ? userData.first_name : ''
                }  ${userData?.last_name ? userData.last_name : ''}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: '94px' }}></div>
    </>
  );
}
