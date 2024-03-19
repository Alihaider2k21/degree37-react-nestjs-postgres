import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SvgComponent from '../../SvgComponent';
import { formatDate } from '../../../../helpers/formatDate';
import { formatUser } from '../../../../helpers/formatUser';
const getNestedValue = (obj, field) => {
  const keys = field.split('.');
  return keys.reduce((result, key) => result[key] || 'N/A', obj);
};

export default function ViewAttachments({ viewApi, editLink, attachId }) {
  const [attachments, setAttachments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await viewApi(attachId);

        if (res?.data?.data) {
          const view = res.data.data;

          const update = {
            name: view?.name,
            category_id: view?.category_id?.name,
            sub_category_id: view?.sub_category_id?.name,
            description: view?.description,
            attachments: view?.attachment_files?.map((e) =>
              e.attachment_path.split('/').pop()
            ),
            attachment_files: view?.attachment_files,
            created_at: view?.created_at,
            created_by: view?.created_by,
            updated_at: view?.modified_at,
            updated_by: view?.modified_by,
          };
          setAttachments(update);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData(); // Call the fetchData function here
  }, [viewApi, attachId]);

  let data = attachments;
  const config = [
    {
      section: 'Attachment Details',
      fields: [
        {
          label: 'Name',
          field: 'name',
        },
        {
          label: 'Category',
          field: 'category_id',
        },
        {
          label: 'Subcategory',
          field: 'sub_category_id',
        },
        {
          label: 'Description',
          field: 'description',
        },
        {
          label: 'Attachments',
          field: 'attachments',
        },
      ],
    },
    {
      section: 'Insights',
      fields: [
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
      <div className="mainContent">
        <div className="mainContentInner">
          <div className="tableView">
            {editLink && (
              <div className="buttons">
                <Link
                  to={editLink}
                  style={{
                    marginTop: '-100px',
                  }}
                >
                  <span className="icon">
                    <SvgComponent name="EditIcon" />
                  </span>
                  <span className="text">Edit Attachment</span>
                </Link>
              </div>
            )}
            <div className="tableViewInner">
              {config?.map((section) => (
                <div className="group" key={section.section}>
                  <div className="group-head">
                    <h2>{section.section}</h2>
                  </div>
                  <div className="group-body">
                    <ul>
                      {isLoading ? (
                        <li>
                          <span className="right-data">
                            <p className="text-center w-100">Data Loading</p>
                          </span>
                        </li>
                      ) : (
                        section.fields.map((item) => (
                          <li key={item.field}>
                            <span
                              className="left-heading"
                              style={{ alignItems: 'left' }}
                            >
                              {item.label}
                            </span>
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
                              ) : item.field === 'attachments' ? (
                                <div className="d-flex flex-row flex-wrap align-items-start">
                                  {data?.attachment_files?.map((dat, i) => {
                                    const e = dat.attachment_path
                                      .split('/')
                                      .pop();

                                    return (
                                      <a
                                        key={i}
                                        href={dat.attachment_path}
                                        target="__blank"
                                      >
                                        <div
                                          key={i}
                                          className="d-flex align-items-center me-4"
                                        >
                                          {e?.includes('.pdf') ? (
                                            <>
                                              <SvgComponent name="PdfIcon" />
                                              <span
                                                style={{
                                                  whiteSpace: 'nowrap',
                                                  maxWidth: '250px',
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis',
                                                }}
                                                className="ms-2"
                                              >
                                                {e}
                                              </span>
                                            </>
                                          ) : e.includes('.png') ||
                                            e.includes('.jpeg') ||
                                            e.includes('.jpg') ? (
                                            <>
                                              <SvgComponent name="image" />
                                              <span
                                                style={{
                                                  whiteSpace: 'nowrap',
                                                  maxWidth: '250px',
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis',
                                                }}
                                                className="ms-2"
                                              >
                                                {e}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <SvgComponent name="otherFileIcon" />
                                              <span
                                                style={{
                                                  whiteSpace: 'nowrap',
                                                  maxWidth: '250px',
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis',
                                                }}
                                                className="ms-2"
                                              >
                                                {e}
                                              </span>
                                            </>
                                          )}

                                          {/* <span className="ms-2">{e}</span> */}
                                        </div>
                                      </a>
                                    );
                                  })}
                                  {(data?.attachments?.length === 0 ||
                                    !data?.attachments) &&
                                    'N/A'}
                                </div>
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
          </div>
        </div>
      </div>
    </>
  );
}
