import React, { useEffect, useState } from 'react';
import ToolTip from '../../../common/tooltip';
import styles from './index.module.scss';
import LossRateIcon from '../../../../assets/images/sessions/loss-rate.svg';
import ProductivityIcon from '../../../../assets/images/sessions/productivity.svg';
import OEFIcon from '../../../../assets/images/sessions/oef.svg';
import FirstTimeDonorIcon from '../../../../assets/images/sessions/first-time-donors.svg';
import { API } from '../../../../api/api-routes';
import { toFloat } from './SessionHistoryUtils';

export default function SessionHistoryAnalytics({
  donorCenterId,
  kindFilter,
  typeFilter,
}) {
  const [analytics, setAnalytics] = useState([]);

  const handleNaN = (value, percent = '') => {
    return isNaN(value) ? 'N/A' : `${value}${percent}`;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response =
        await API.systemConfiguration.organizationalAdministrations.facilities.getSessionHistoryKPI(
          donorCenterId,
          kindFilter !== 'Procedures'
        );
      const data = response?.data?.data || {};
      const lossRate =
        parseFloat(data?.deferrals) +
        parseFloat(data?.qns) +
        parseFloat(data?.walkouts) +
        parseFloat(data?.void);

      setAnalytics([
        {
          title: 'Loss Rate',
          icon: LossRateIcon,
          total: handleNaN(lossRate.toFixed(2)),
          items: [
            {
              name: 'Deferrals',
              value: handleNaN(
                toFloat(data?.deferrals, lossRate, hidePercentage)
              ),
            },
            {
              name: 'QNS',
              value: handleNaN(toFloat(data?.qns, lossRate, hidePercentage)),
            },
            {
              name: 'Walkouts',
              value: handleNaN(
                toFloat(data?.walkouts, lossRate, hidePercentage)
              ),
            },
            {
              name: 'Void',
              value: handleNaN(toFloat(data?.void, lossRate, hidePercentage)),
            },
          ],
        },
        {
          title: 'Productivity',
          icon: ProductivityIcon,
          total: null,
          items: [
            {
              name: 'Projection',
              value: handleNaN(
                toFloat(data?.projection, data?.slots, hidePercentage)
              ),
            },
            {
              name: 'Registered',
              value: handleNaN(
                toFloat(data?.registered, data?.slots, hidePercentage)
              ),
            },
            {
              name: 'Actual',
              value: handleNaN(
                toFloat(data?.actual, data?.slots, hidePercentage)
              ),
            },
            {
              name: 'Projection Accuracy',
              value: handleNaN(
                parseFloat(data?.projection_accuracy).toFixed(2),
                '%'
              ),
            },
            {
              name: 'Appointments',
              value: handleNaN(
                toFloat(data?.appointment, data?.slots, hidePercentage)
              ),
            },
          ],
        },
        {
          title: 'OEF',
          icon: OEFIcon,
          total: handleNaN(toFloat(data?.oef)),
        },
        {
          title: 'First Time Donor',
          icon: FirstTimeDonorIcon,
          total: handleNaN(
            toFloat(data?.ftd, data?.registered, hidePercentage)
          ),
        },
      ]);
    };

    const hidePercentage = typeFilter === 'Percentage';
    fetchAnalytics();
  }, [donorCenterId, kindFilter, typeFilter]);

  return (
    <div className="filterBar">
      <div className="filterInner d-block">
        <h2 className="d-flex gap-2 py-4">
          Key Performance Indicators (
          {kindFilter === 'Procedures' ? 'Products' : 'Procedures'}){' '}
          <ToolTip
            text={
              'Averages are caculated using the four most recent completed drives.'
            }
          />
        </h2>

        <div className="d-flex justify-content-between">
          {analytics?.map((row, idx1) => (
            <div key={idx1} className={`${styles.analytics}`}>
              <img src={row.icon} alt="Loss rate" />
              <table>
                <tr>
                  <td>
                    <h2>{row.title}</h2>
                  </td>
                  <td>
                    <p>{row.total}</p>
                  </td>
                </tr>
                {row.items?.map((item, idx2) => (
                  <tr key={idx2}>
                    <td>
                      <p>{item.name}</p>
                    </td>
                    <td>
                      <p>{item.value}</p>
                    </td>
                  </tr>
                ))}
              </table>
              <div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
