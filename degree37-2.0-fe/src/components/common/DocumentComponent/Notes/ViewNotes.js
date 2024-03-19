import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SvgComponent from '../../SvgComponent';
import { toast } from 'react-toastify';
import { API } from '../../../../api/api-routes';
import { formatDate } from '../../../../helpers/formatDate';
import { formatUser } from '../../../../helpers/formatUser';
import './index.scss';

const getNestedValue = (obj, field) => {
  const keys = field.split('.');
  return keys.reduce((result, key) => result[key] || 'N/A', obj);
};
export default function ViewNotes({ editLink }) {
  const [NotesViewData, setNotesViewData] = useState();
  const { noteId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // getEdit();
    getViewNotes();
  }, []);

  const getViewNotes = async () => {
    try {
      setIsLoading(true);
      const response = await API.crm.documents.notes.getNoteByID(noteId);
      if (response?.data?.data) {
        const notes = response?.data?.data;
        const updated = {
          note_name: notes?.note_name,
          details: notes?.details,
          category_id: notes?.category_id?.name,
          sub_category_id: notes?.sub_category_id?.name,
          created_by: notes?.created_by,
          created_at: notes?.created_at,
          updated_at: notes?.modified_at,
          updated_by: notes?.modified_by,
          status: notes?.is_active,
        };
        setNotesViewData(updated);

        // setShowUpdatedNote(true);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };
  let data = NotesViewData;

  const config = [
    {
      section: 'Note Details',
      fields: [
        {
          label: 'Name',
          field: 'note_name',
        },
        {
          label: 'Category',
          field: 'category_id',
        },
        {
          label: 'Subcategory',
          field: 'sub_category_id',
        },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'status',
          format: (value) => (value ? 'Active' : 'Inactive'),
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
    {
      section: 'Note',
      fields: [
        {
          label: 'details',
          field: '',
        },
      ],
    },
  ];

  return (
    <>
      {data && (
        <div className="mainContent">
          <div className="mainContentInner">
            <div className="tableView">
              <div className="buttons m-0">
                <Link
                  to={editLink}
                  style={{
                    marginTop: '-100px',
                  }}
                >
                  <span className="icon">
                    <SvgComponent name="EditIcon" />
                  </span>
                  <span className="text">Edit Note</span>
                </Link>
              </div>
              <div
                className="tableViewInner row tableViewInnerWidth "
                style={{ width: '100% !important' }}
              >
                <div className="col-6">
                  {config.slice(0, 2).map((section, index) => (
                    <div
                      style={{
                        height: 'fit-content',
                      }}
                      className="group "
                      key={section.section}
                    >
                      <div className="group-head">
                        <h2>{section.section}</h2>
                      </div>
                      <div className="group-body">
                        <ul>
                          {isLoading ? (
                            <li>
                              <span className="right-data d-flex justify-content-center align-items-center">
                                Data Loading
                              </span>
                            </li>
                          ) : (
                            section.fields.map((item) => (
                              <li key={item.field}>
                                <span className="left-heading">
                                  {item.label}
                                </span>
                                <span
                                  className={`right-data ${
                                    item.className || ''
                                  }`}
                                >
                                  {item?.field === 'status' ? (
                                    data[item?.field] ? (
                                      <span className="badge active">
                                        Active
                                      </span>
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
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
                {config.slice(2, 3).map((section, index) => (
                  <div className="group col-6" key={section.section}>
                    <div className="group-head">
                      <h2>{section.section}</h2>
                    </div>
                    <div className="group-body editor-view">
                      {isLoading ? (
                        <span className="right-data d-flex justify-content-center align-items-center loading-data">
                          Data Loading
                        </span>
                      ) : (
                        section.fields.map((item) => (
                          <div key={item.field}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  data?.details ||
                                  '<i style="text-align:center;width:100%">N/A </i>',
                              }}
                              className={`right-data ${item.className || ''}`}
                            ></div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
