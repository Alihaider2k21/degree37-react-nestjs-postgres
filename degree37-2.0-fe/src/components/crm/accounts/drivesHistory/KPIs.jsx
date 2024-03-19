import React from 'react';
import styles from './index.module.scss';
import LossRateIcon from '../../../../assets/images/sessions/loss-rate.svg';
import ProductivityIcon from '../../../../assets/images/sessions/productivity.svg';
import OEFIcon from '../../../../assets/images/sessions/oef.svg';
import FirstTimeDonorIcon from '../../../../assets/images/sessions/first-time-donors.svg';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import SvgComponent from '../../../common/SvgComponent';

export default function KPIs({
  data,
  viewNumbersPercentage,
  viewProductsProcedure,
}) {
  const handleNaN = (value, percent = '') => {
    return isNaN(value) ? 'N/A' : `${value}${percent}`;
  };

  const analytics = [
    {
      title: 'Loss Rate',
      icon: LossRateIcon,
      total: handleNaN(data.lossRateTotal.toFixed(2)),
      items: [
        {
          name: 'Deferrals',
          value:
            viewNumbersPercentage === 'numbers'
              ? handleNaN(data.lossRateDeferrals.toFixed(2))
              : `${handleNaN(
                  (
                    (data?.lossRateDeferrals / data?.lossRateTotal) *
                    100
                  ).toFixed(2),
                  '%'
                )}`,
        },
        {
          name: 'QNS',
          value:
            viewNumbersPercentage === 'numbers'
              ? handleNaN(data.lossQns.toFixed(2))
              : `${handleNaN(
                  ((data?.lossQns / data?.lossRateTotal) * 100).toFixed(2),
                  '%'
                )}`,
        },
        {
          name: 'Walkouts',
          value:
            viewNumbersPercentage === 'numbers'
              ? handleNaN(data.lossWalkouts.toFixed(2))
              : `${handleNaN(
                  ((data?.lossWalkouts / data?.lossRateTotal) * 100).toFixed(2),
                  '%'
                )}`,
        },
        {
          name: 'Void',
          value: viewNumbersPercentage === 'numbers' ? '0' : '0%',
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
          value:
            viewProductsProcedure === 'procedures'
              ? data?.projProc
                ? data?.projProc.toFixed(2)
                : 0
              : data?.projProd
              ? data?.projProd.toFixed(2)
              : 0,
        },
        {
          name: 'Registered',
          value:
            viewNumbersPercentage === 'numbers'
              ? data?.registered
                ? data.registered.toFixed(2)
                : 0
              : `${handleNaN(
                  ((data?.registered / data?.slots) * 100).toFixed(2),
                  '%'
                )}`,
        },
        {
          name: 'Actual',
          value:
            viewNumbersPercentage === 'numbers'
              ? data?.actual
                ? data.actual.toFixed(2)
                : 0
              : `${handleNaN(
                  ((data?.actual / data?.registered) * 100).toFixed(2),
                  '%'
                )}`,
        },
        {
          name: 'Projection Accuracy',
          value: `${(data?.pa && data?.pa.toFixed(2)) || 0}%`,
        },
        {
          name: 'Appointments',
          value:
            viewNumbersPercentage === 'numbers'
              ? data?.appointment_count
                ? data.appointment_count.toFixed(2)
                : 0
              : `${handleNaN(
                  ((data?.appointment_count / data?.slots) * 100).toFixed(2),
                  '%'
                )}`,
        },
      ],
    },
    {
      title: 'OEF',
      icon: OEFIcon,
      total:
        viewProductsProcedure === 'procedures'
          ? data?.sumOEFProcedures
            ? data.sumOEFProcedures.toFixed(2)
            : 0
          : data?.sumOEFProducts
          ? data.sumOEFProducts.toFixed(2)
          : 0,
    },
    {
      title: 'First Time Donors',
      icon: FirstTimeDonorIcon,
      className: 'w-75',
      total:
        viewNumbersPercentage === 'numbers'
          ? (data?.firstTimeDonors && data?.firstTimeDonors.toFixed(2)) || 0
          : `${handleNaN(
              ((data?.firstTimeDonors / data?.totalDonors) * 100).toFixed(2),
              '%'
            )}`,
    },
  ];

  return (
    <div className="filterBar">
      <div className="filterInner d-block">
        <h2 className="d-flex gap-2 py-4">
          Key Performance Indicators (
          {viewProductsProcedure === 'products' ? 'Products' : 'Procedures'})
          <OverlayTrigger
            placement="right"
            styles={{ maxWidth: '500px' }}
            id="contactTooltip"
            overlay={(props) => (
              <Tooltip id="addContactsSectionDrivesTooltip" {...props}>
                Averages are caculated using the four most <br />
                recent completed drives.
              </Tooltip>
            )}
          >
            <div className={`me-0`}>
              <SvgComponent name={'ToolTipIcon'} />
            </div>
          </OverlayTrigger>
        </h2>

        <div className="d-flex justify-content-between">
          {analytics?.map((row, idx1) => (
            <div key={idx1} className={`${styles.analytics}`}>
              <img src={row.icon} alt="Loss rate" />
              <table>
                <tr>
                  <td>
                    <h2 className={row.className}>{row.title}</h2>
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
