import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import TopBar from '../topbar/index';
// import { formatDate } from '../../../../helpers/formatDate';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import { formatDate } from '../../../../../../helpers/formatDate';
import { formatUser } from '../../../../../../helpers/formatUser';
import './index.scss';

const getNestedValue = (obj, field) => {
  const keys = field.split('.');
  return keys.reduce((result, key) => (result ? result[key] : ''), obj);
};
export default function ViewDirections({ editLink }) {
  const [DirectionViewData, setDirectionViewData] = useState();
  const [location, setLocation] = useState({});
  const { directionId, locationId } = useParams();

  useEffect(() => {
    // getEdit();
    getViewNotes();
    fetchLocation();
  }, []);
  const fetchLocation = async () => {
    API.crm.location
      .getLocation(locationId)
      .then((res) => setLocation(res?.data?.data))
      .catch((er) => toast.error('Failed to fetch location'));
  };
  const getViewNotes = async () => {
    try {
      const response =
        await API.crm.location.directions.getDirectionByID(directionId);
      if (response?.data?.data) {
        const notes = response?.data?.data;
        const updated = {
          collection_operation: notes?.collection_operation_id.name,
          direction: notes?.direction,
          created_by: notes.created_by,
          created_at: notes.created_at,
          miles: notes?.miles?.toFixed(2),
          minutes: notes?.minutes,
          updated_at: notes?.modified_at,
          updated_by: notes?.modified_by,
          status: notes?.is_active,
        };
        // console.log(updated);
        setDirectionViewData(updated);

        // setShowUpdatedNote(true);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  let data = DirectionViewData;

  const config = [
    {
      section: 'Direction Details',
      fields: [
        {
          label: 'Location',
          field: 'location',
        },
        {
          label: 'Direction',
          field: 'direction',
        },
        {
          label: 'Collection Operation',
          field: 'collection_operation',
        },
        {
          label: 'Miles',
          field: 'miles',
        },
        {
          label: 'Minutes',
          field: 'minutes',
        },
      ],
    },

    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'status',
        },
        {
          label: 'Created',
          field: 'created_by',
        },
        {
          label: 'Modified',
          field: 'updated_by',
        },
      ],
    },
  ];
  return (
    <>
      {data && (
        <div className="mainContent">
          {/* <TopBar
        BreadCrumbsData={breadcrumbsData}
        BreadCrumbsTitle={breadcrumbsTitle}
      /> */}
          <div className="mainContentInner">
            <div className="tableView">
              <div
                className="tableViewInner row tableViewInnerWidth "
                style={{ width: '100% !important', flexDirection: 'column' }}
              >
                {config.map((section, index) =>
                  index === 1 ? (
                    <div className="group col-6" key={section.section}>
                      <div className="group-head">
                        <h2>{section.section} </h2>
                      </div>
                      <div className="group-body">
                        <ul>
                          {section.fields.map((item) => (
                            <li key={item.field}>
                              <span className="left-heading">{item.label}</span>
                              <span
                                className={`right-data ${item.className || ''}`}
                              >
                                {item?.field === 'status' ? (
                                  data[item?.field] ? (
                                    <span className="badge active">Active</span>
                                  ) : (
                                    <span className="badge inactive">
                                      Inactive
                                    </span>
                                  )
                                ) : item?.field === 'created_by' ? (
                                  <span>
                                    {formatUser(
                                      data?.created_by ?? data?.created_by
                                    )}
                                    {formatDate(
                                      data?.created_at ?? data?.created_at
                                    )}
                                  </span>
                                ) : item.field === 'updated_by' ? (
                                  <span>
                                    {formatUser(
                                      data?.updated_by
                                        ? data?.updated_by
                                        : data?.created_by
                                    )}
                                    {formatDate(
                                      data?.updated_at
                                        ? data?.updated_at
                                        : data?.created_at
                                    )}
                                  </span>
                                ) : (
                                  getNestedValue(data, item.field)
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="group col-6" key={section.section}>
                      <div className="group-head">
                        <h2>{section.section}</h2>
                      </div>
                      <div className="group-body">
                        <ul>
                          {section.fields.map((item) => (
                            <li key={item.field}>
                              <span className="left-heading">{item.label}</span>
                              <span
                                className={`right-data ${item.className || ''}`}
                              >
                                {item?.field === 'location'
                                  ? location
                                    ? location?.name
                                    : ''
                                  : ''}
                                {item?.field === 'status' ? (
                                  data[item?.field] ? (
                                    <span className="badge active">Active</span>
                                  ) : (
                                    <span className="badge inactive">
                                      Inactive
                                    </span>
                                  )
                                ) : item?.field === 'created_by' ? (
                                  <span>
                                    {formatUser(
                                      data?.created_by ?? data?.created_by
                                    )}
                                    {formatDate(
                                      data?.created_at ?? data?.created_at
                                    )}
                                  </span>
                                ) : item.field === 'updated_by' ? (
                                  <span>
                                    {formatUser(
                                      data?.modified_by
                                        ? data?.modified_by
                                        : data?.created_by
                                    )}
                                    {formatDate(
                                      data?.modified_at
                                        ? data?.modified_at
                                        : data?.created_at
                                    )}
                                  </span>
                                ) : (
                                  getNestedValue(data, item.field)
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// const ViewForm = ({
//   breadcrumbsData,
//   breadcrumbsTitle,
//   editLink,
//   data,
//   config,
// }) => {
//   return (
//     <div className="mainContent">
//       <TopBar
//         BreadCrumbsData={breadcrumbsData}
//         BreadCrumbsTitle={breadcrumbsTitle}
//       />
//       <div className="mainContentInner">
//         <div className="tableView">
//           {editLink && (
//             <div className="buttons">
//               <Link to={editLink}>
//                 <span className="icon">
//                   <SvgComponent name="EditIcon" />
//                 </span>
//                 <span className="text">Edit</span>
//               </Link>
//             </div>
//           )}
//           <div className="tableViewInner">
//             {config.map((section) => (
//               <div className="group" key={section.section}>
//                 <div className="group-head">
//                   <h2>{section.section}</h2>
//                 </div>
//                 <div className="group-body">
//                   <ul>
//                     {section.fields.map((item) => (
//                       <li key={item.field}>
//                         <span className="left-heading">{item.label}</span>
//                         <span className={`right-data ${item.className || ''}`}>
//                           {item.field === 'status' ? (
//                             data[item.field] ? (
//                               <span className="badge active">Active</span>
//                             ) : (
//                               <span className="badge inactive">Inactive</span>
//                             )
//                           ) : item.field === 'created_by' ? (
//                             <span>
//                               {data?.created_by?.first_name}{' '}
//                               {formatDate(data?.created_at)}
//                             </span>
//                           ) : item.field === 'updated_by' ? (
//                             <span>
//                               {data?.created_by?.first_name}{' '}
//                               {formatDate(data?.updated_at)}
//                             </span>
//                           ) : (
//                             getNestedValue(data, item.field)
//                           )}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewForm;
