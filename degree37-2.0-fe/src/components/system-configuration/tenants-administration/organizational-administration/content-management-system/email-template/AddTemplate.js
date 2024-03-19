import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';

import { toast } from 'react-toastify';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import styles from './index.module.scss';
import img from '../../../../../../assets/email-warning.svg';
import { ContentManagementSystemBreadCrumbsData } from '../ContentManagementSystemBreadCrumbsData';
import SelectDropdown from '../../../../../common/selectDropdown';
import TemplateTypeEnum from '../entities/template-type.enum';
import axios from 'axios';
import SuccessPopUpModal from '../../../../../common/successModal';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api.js';

const AddTemplate = () => {
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [templateType, setTemplateType] = useState(null);
  const [template, setTemplate] = useState(null);
  const [variables, setVariables] = useState([]);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showCreateSuccessModal, setShowCreateSuccessModal] = useState(false);

  const [dsTemplates, setDsTemplates] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [templateTypeData, setTemplateTypeData] = useState([]);
  const [errors, setErrors] = useState({
    template_name: '',
    template_type: '',
    template_subject: '',
    template_body: '',
  });
  const token = localStorage.getItem('token');

  const handleCancelClick = () => {
    setShowConfirmationDialog(true);
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate('/system-configuration/platform-admin/email-template');
    }
  };

  useEffect(() => {
    fetchTemplateData();
    getDSTemplates();
  }, [BASE_URL]);

  const fetchTemplateData = async () => {
    try {
      const { data, status } = await axios.get(`${BASE_URL}/templates`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (status === 200) {
        setTemplateTypeData(data?.data);
      } else {
        setTemplateTypeData([]);
      }
    } catch (error) {
      console.error('Error templates:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let variable = '';
      variables?.map((item, i, row) => {
        if (i + 1 === row.length) {
          variable = variable + item.variable;
        } else {
          variable = variable + item.variable + ',';
        }
      });

      const body = {
        templateId: parseInt(template?.value),
        name: template?.label,
        subject: subject,
        type: templateType?.value,
        status: status,
        content: description,
        variables: variable,
      };

      let isError = false;

      if (!body.templateId || !body.name) {
        isError = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          template_name: 'Template is required.',
        }));
      }
      if (!body.subject) {
        isError = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          template_subject: 'Subject is required.',
        }));
      }
      if (body.subject.length > 255) {
        isError = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          template_subject: 'Subject length cannot exceed 255 characters.',
        }));
      }

      if (!body.type) {
        isError = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          template_type: 'Type is required.',
        }));
      }
      if (!body.content) {
        isError = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          template_body: 'Content is required.',
        }));
      }
      if (!isError) {
        await axios.post(`${BASE_URL}/email-templates`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setShowCreateSuccessModal(true);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
    if (event.target.value) {
      if (event.target.value.length > 255) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          template_subject: 'Subject length cannot exceed 255 characters.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          template_subject: '',
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        template_subject: 'Subject is required.',
      }));
    }
  };

  const handleTemplateTypeChange = (event) => {
    const { value } = event.target;
    setTemplateType(value);
    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        template_type: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        template_type: 'Type is required.',
      }));
    }
  };

  const handleTemplateChange = (event) => {
    const { value } = event.target;
    setTemplate(value);
    if (value) {
      const templateFound = templateTypeData?.find((item) => {
        return item.id == value.value;
      });
      if (templateFound) {
        setVariables(templateFound?.variables);
      } else {
        setVariables([]);
      }
    } else {
      setVariables([]);
    }
    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        template_name: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        template_name: 'Template is required.',
      }));
    }
  };

  const handleIsActiveChange = (event) => {
    setStatus(event.target.checked);
  };

  const handleInputBlur = (e, config_name = null, state_name = null) => {
    const { name, value } = e.target;
    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage = 'Subject is required.';
    } else if (value.length > 255) {
      errorMessage = 'Subject length cannot exceed 255 characters.';
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    setError(name, errorMessage);
  };

  const BreadcrumbsData = [
    ...ContentManagementSystemBreadCrumbsData,
    {
      label: 'Create Template',
      class: 'disable-label',
      link: '/system-configuration/platform-admin/email-template/create',
    },
  ];
  const getDSTemplates = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/contacts/volunteers/communications/email-templates?campaignId=1549`
      );
      const data = await response.json();
      if (data.status !== 500) {
        setDsTemplates(data?.Response?.emails);
      }
    } catch (error) {
      toast.error(`Failed to fetch Email Templates ${error}`, {
        autoClose: 3000,
      });
    }
  };

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then((file) => {
            const fileName = file.name;
            const fileType = file.type;
            const s3 = new AWS.S3({
              accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
              region: process.env.REACT_APP_AWS_REGION,
            });

            const params = {
              Bucket: `${process.env.REACT_APP_AWS_BUCKET_NAME}`,
              Key: fileName,
              Body: file,
              ACL: 'public-read', // Set the appropriate ACL permissions
              ContentType: fileType,
            };

            s3.upload(params, (err, data) => {
              if (err) {
                console.log({ err });
                reject(err);
              } else {
                resolve({
                  default: data.Location, // The uploaded file's S3 URL
                });
              }
            });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  const editorConfiguration = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'heading',
        '|',
        'bold',
        'italic',
        '|',
        'link',
        'imageUpload',
        'insertTable',
        '|',
        'bulletedList',
        'numberedList',
        'strikethrough',
        'subscript',
        'superscript',
        'blockQuote',
      ],
    },
    extraPlugins: [uploadPlugin],
  };

  return (
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Email Templates'}
          SearchPlaceholder={null}
          SearchValue={null}
          SearchOnChange={null}
        />
        <div className="mainContentInner form-container">
          <form className={`formGroup ${styles.addAdminRoles}`}>
            <div className={`formGroup ${styles.form_group}`}>
              <h5 className={`${styles.create_template_h5}`}>
                Create Template
              </h5>
              <div className={`form-field ${styles.form_feild}`}>
                <div className="field">
                  <SelectDropdown
                    styles={{ root: 'w-100 m-0' }}
                    placeholder={'Select Template*'}
                    defaultValue={template}
                    selectedValue={template}
                    removeDivider
                    showLabel
                    onChange={(val) => {
                      let e = {
                        target: {
                          name: 'template_name',
                          value: val,
                        },
                      };
                      handleTemplateChange(e);
                    }}
                    options={
                      templateTypeData?.length > 0
                        ? templateTypeData.map((item) => {
                            const capitalizedTitle =
                              item.title.charAt(0).toUpperCase() +
                              item.title.slice(1);
                            return {
                              label: capitalizedTitle,
                              value: item.id,
                            };
                          })
                        : []
                    }
                  />
                  {errors.template_name && (
                    <div className="error">
                      <p>{errors.template_name}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className={`form-field ${styles.form_feild}`}>
                <div className="field">
                  <SelectDropdown
                    styles={{ root: 'w-100 m-0' }}
                    placeholder={'Select DS Template'}
                    defaultValue={templateType}
                    selectedValue={templateType}
                    removeDivider
                    showLabel
                    options={
                      dsTemplates?.length > 0
                        ? dsTemplates.map((el) => ({
                            label: el.name,
                            value: el.emailId,
                          }))
                        : []
                    }
                  />
                </div>
              </div>
              <div className={`form-field ${styles.form_feild}`}>
                <div className="field">
                  <SelectDropdown
                    styles={{ root: 'w-100 m-0' }}
                    placeholder={'Select Type*'}
                    defaultValue={templateType}
                    selectedValue={templateType}
                    removeDivider
                    showLabel
                    onChange={(val) => {
                      let e = {
                        target: {
                          name: 'template_type',
                          value: val,
                        },
                      };
                      handleTemplateTypeChange(e);
                    }}
                    options={Object.values(TemplateTypeEnum).map((item) => {
                      return {
                        label: item,
                        value: item,
                      };
                    })}
                  />
                  {errors.template_type && (
                    <div className="error">
                      <p>{errors.template_type}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className={`form-field`}>
                <div className="field">
                  <input
                    type="text"
                    className="form-control"
                    name="template_subject"
                    placeholder=" "
                    onChange={handleSubjectChange}
                    onBlur={handleInputBlur}
                    required
                  />

                  <label>Enter Subject*</label>
                </div>
                {errors.template_subject && (
                  <div className="error">
                    <p>{errors.template_subject}</p>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {variables?.map((item, index) => {
                  return (
                    <span key={index} className={`${styles.secondary}`}>
                      {item.variable}
                    </span>
                  );
                })}
              </div>

              <div className="w-100 mt-3 mb-5" style={{ height: '325px' }}>
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setDescription(data);
                    if (!data == '') {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        template_body: '',
                      }));
                    } else {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        template_body: 'Template body is required.',
                      }));
                    }
                  }}
                  onReady={(editor) => {
                    editor.editing.view.change((writer) => {
                      writer.setStyle(
                        'min-height',
                        '320px',
                        editor.editing.view.document.getRoot()
                      );
                      writer.setStyle(
                        'height',
                        '320px',
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                  config={editorConfiguration}
                />
                <div className="form-field">
                  {errors.template_body && (
                    <div className="error">
                      <p>{errors.template_body}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-field checkbox w-100 mt-4">
                <span className="toggle-text">
                  {status ? 'Active' : 'Inactive'}
                </span>
                <label htmlFor="toggle" className="switch">
                  <input
                    type="checkbox"
                    id="toggle"
                    className="toggle-input"
                    name="is_active"
                    checked={status}
                    onChange={handleIsActiveChange}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <img src={img}></img>
            </div>
          </form>

          <section
            className={`popup full-section ${
              showConfirmationDialog ? 'active' : ''
            }`}
          >
            <div className="popup-inner">
              <div className="icon">
                <img src={CancelIconImage} alt="CancelIcon" />
              </div>
              <div className="content">
                <h3>Confirmation</h3>
                <p>Unsaved changes will be lost. Do you want to continue?</p>
                <div className="buttons">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleConfirmationResult(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleConfirmationResult(true)}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className={`${styles.form_footer}`}>
            <div></div>
            <div>
              <span
                style={{ cursor: 'pointer' }}
                className=" text-primary border-0 "
                onClick={handleCancelClick}
              >
                Cancel
              </span>
              <button
                type="button"
                className={`rounded border border-primary bg-primary`}
                onClick={handleSubmit}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      {showCreateSuccessModal === true ? (
        <SuccessPopUpModal
          title="Success!"
          message={`Email template created.`}
          modalPopUp={showCreateSuccessModal}
          isNavigate={true}
          redirectPath={'/system-configuration/platform-admin/email-template'}
          setModalPopUp={setShowCreateSuccessModal}
          showActionBtns={true}
        />
      ) : null}
    </>
  );
};

export default AddTemplate;
