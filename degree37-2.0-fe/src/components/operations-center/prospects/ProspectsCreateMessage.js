import React, { useEffect, useState } from 'react';
import TopBar from '../../common/topbar/index';
import axios from 'axios';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../common/successModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { OPERATIONS_CENTER, OS_PROSPECTS_PATH } from '../../../routes/path';
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import SelectDropdown from '../../common/selectDropdown';
import DatePicker from '../../common/DatePicker';
import styles from './index.module.scss';
import htmlToDraft from 'html-to-draftjs';

const variablesKey = [
  {
    name: 'CP Title',
    value: 'cp_title',
  },
  {
    name: 'CP First',
    value: 'cp_first',
  },
  {
    name: 'CP Last',
    value: 'cp_last',
  },
  {
    name: 'Account Name',
    value: 'account_name',
  },
  {
    name: 'Next Drive Date',
    value: 'next_drive_date',
  },
  {
    name: 'Recruiter',
    value: 'recruiter',
  },
  {
    name: 'Last Eligible Date',
    value: 'last_eligible_date',
  },
];

const ProspectsCreateMessage = () => {
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const location = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [emailData, setEmailData] = useState('<p></p>/n');
  const [templateTypeData, setTemplateTypeData] = useState([]);
  const [changesMadeMessage, setChangesMadeMessage] = useState(false);
  const [errors, setErrors] = useState({ template_name: '' });

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Prospect',
      class: 'active-label',
      link: OS_PROSPECTS_PATH.CREATE,
    },
    {
      label: 'Build Segment',
      class: 'active-label',
      link: OS_PROSPECTS_PATH.BUILD_SEGMENTS,
    },
    {
      label: 'Create Message',
      class: 'active-label',
      link: OS_PROSPECTS_PATH.CREATE_MESSAGE,
    },
  ];
  const validateErrors = () => {
    let errorsTemp = {};
    let isError = false;
    if (!emailData || emailData === '<p></p>/n') {
      errorsTemp = { ...errors, emailData: 'Message is required.' };
      isError = true;
    }
    if (!scheduleDate) {
      errorsTemp = {
        ...errorsTemp,
        scheduleDate: 'Schedule send is required.',
      };
      isError = true;
    }
    if (!selectedTemplate) {
      errorsTemp = { ...errorsTemp, template_name: 'Template is required.' };
      isError = true;
    }
    setErrors({ ...errorsTemp });
    return isError;
  };

  const submitHandler = async () => {
    if (validateErrors()) return;
    if (
      errors?.template_name ||
      errors?.scheduleDate ||
      errors?.emailData ||
      emailData === '<p></p>/n'
    ) {
      return;
    }

    if (
      !location?.state?.name ||
      !location?.state?.description ||
      !location?.state?.is_active ||
      !location?.state?.blueprints
    ) {
      toast.dismiss();
      return toast.error(
        'One or more prospect details missing please start from create prospect screen.'
      );
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${BASE_URL}/operations-center/prospects`,
        {
          name: location?.state?.name,
          description: location?.state?.description,
          status: location?.state?.is_active,
          blueprints_ids: location?.state?.blueprints,
          template_id: selectedTemplate?.value,
          message: emailData.replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
          schedule_date: scheduleDate,
        },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      setIsLoading(false);

      if (res?.data?.response === 'Name already exists.') {
        toast.error('Prospect with this name already exists.');
      }

      if (res?.data?.status_code === 201) {
        setShowSuccessMessage(true);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Error while creating prospect');
      console.log({ error });
    }
  };

  const handleCancel = () => {
    if (emailData !== '<p></p>/n' || scheduleDate || selectedTemplate)
      setShowCancelModal(true);
    else navigate(-2);
  };

  const fetchTemplateData = async () => {
    try {
      const { data, status } = await axios.get(
        `${BASE_URL}/contacts/volunteers/communications/email-templates?campaignId=1549`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status === 200) {
        setTemplateTypeData(
          data?.Response?.emails?.map((templateTemp) => ({
            value: templateTemp?.emailId,
            label: templateTemp?.name,
            previewUrl: templateTemp?.previewUrl,
          }))
        );
      } else {
        setTemplateTypeData([]);
      }
    } catch (error) {
      console.error('Error templates:', error);
    }
  };
  const handleTemplateChange = (value) => {
    if (!value) {
      setErrors({ ...errors, template_name: 'Template is required.' });
    } else setErrors({ ...errors, template_name: '' });
    setSelectedTemplate(value);
  };
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTemplateData();
  }, []);

  const handleVariableClick = (value) => {
    const dataUpdated =
      emailData?.split('</p>')?.[0] + `&lt;${value}&gt;</p>\n`;
    const contentBlock = htmlToDraft(dataUpdated);
    if (contentBlock) {
      setEmailData((prev) => (prev = dataUpdated));
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  };
  const showTemplateWarning = () => {
    toast.warn('Select template to preview.');
  };
  return (
    <div className="mainContent ">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Prospect'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form>
          <div className="formGroup">
            <div className="d-flex w-100">
              <h5>Create Message</h5>
              {selectedTemplate?.previewUrl ? (
                <Link
                  className={styles.linkPreview}
                  target="_blank"
                  to={selectedTemplate?.previewUrl}
                >
                  Preview
                </Link>
              ) : (
                <Link
                  className={styles.linkPreview}
                  onClick={showTemplateWarning}
                >
                  Preview
                </Link>
              )}
            </div>
            <div className="d-flex">
              {variablesKey?.map((item) => {
                return (
                  <p
                    onClick={() => handleVariableClick(item.value)}
                    className={`${styles.badge}`}
                    key={item.name}
                  >
                    {item.name}
                  </p>
                );
              })}
            </div>
            <div
              style={{
                overflow: 'auto',
                height: '300px',
                border: '1px solid #F1F1F1',
                borderRadius: '8px',
              }}
              className="w-100 form-field"
            >
              <Editor
                editorState={editorState}
                onBlur={() => {
                  if (emailData === '<p></p>\n' || !emailData)
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      emailData: 'Message is required.',
                    }));
                  else
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      emailData: '',
                    }));
                }}
                onEditorStateChange={setEditorState}
                onChange={(state) => {
                  const contentAsHTML = draftToHtml(state);
                  setEmailData((prevstate) => (prevstate = contentAsHTML));
                  if (
                    (contentAsHTML === '<p></p>\n' || !contentAsHTML) &&
                    changesMadeMessage
                  )
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      emailData: 'Message is required.',
                    }));
                  else {
                    setChangesMadeMessage(true);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      emailData: '',
                    }));
                  }
                }}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                toolbar={{
                  options: [
                    'inline',
                    'fontSize',
                    'textAlign',
                    'list',
                    'blockType',
                    'link',
                    'history',
                  ],
                  inline: {
                    options: ['bold', 'italic', 'underline'],
                  },
                  fontSize: {
                    options: [
                      8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96,
                    ],
                  },
                  textAlign: {
                    options: ['left', 'center'],
                  },
                  list: {
                    options: ['ordered'],
                  },

                  blockType: {
                    inDropdown: true,
                    options: [
                      'Normal',
                      'H1',
                      'H2',
                      'H3',
                      'H4',
                      'H5',
                      'H6',
                      'BlockType',
                      'Code',
                      { label: 'My Custom Block', style: 'my-custom-block' },
                    ],
                  },
                  link: {
                    options: ['link'],
                  },
                }}
              />
            </div>
            {errors?.emailData && (
              <div>
                <p className={styles.error}>{errors.emailData}</p>
              </div>
            )}
            <div className="mt-2 w-100" />
            <SelectDropdown
              placeholder={'Select Template*'}
              defaultValue={selectedTemplate}
              selectedValue={selectedTemplate}
              removeDivider
              showLabel
              onBlur={() => {
                selectedTemplate?.value
                  ? setErrors((prevErrors) => ({
                      ...prevErrors,
                      template_name: '',
                    }))
                  : setErrors((prevErrors) => ({
                      ...prevErrors,
                      template_name: 'Template is required.',
                    }));
              }}
              error={errors?.template_name}
              onChange={handleTemplateChange}
              options={templateTypeData}
            />
            <div className={`form-field position-relative`}>
              <DatePicker
                selected={scheduleDate}
                showLabel={true}
                onBlur={() =>
                  scheduleDate
                    ? setErrors({ ...errors, scheduleDate: '' })
                    : setErrors({
                        ...errors,
                        scheduleDate: 'Schedule send is required.',
                      })
                }
                onChange={(value) => {
                  value
                    ? setErrors({ ...errors, scheduleDate: '' })
                    : setErrors({
                        ...errors,
                        scheduleDate: 'Schedule send is required.',
                      });
                  setScheduleDate(value);
                }}
                minDate={new Date()}
                isClearable={true}
                placeholderText="Schedule Send*"
              />
              {errors?.scheduleDate && (
                <div>
                  <p className={styles.error}>{errors.scheduleDate}</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="form-footer">
        <button
          className="btn btn-secondary border-0"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={isLoading}
          className={` ${`btn btn-primary`}`}
          onClick={submitHandler}
        >
          Create
        </button>
        <SuccessPopUpModal
          title="Success!"
          message={'Prospect created.'}
          modalPopUp={showSuccessMessage}
          isNavigate={false}
          showActionBtns={true}
          isArchived={false}
          setModalPopUp={setShowSuccessMessage}
        />
        <SuccessPopUpModal
          title="Confirmation"
          message={'Unsaved changes will be lost. Do you want to continue?'}
          modalPopUp={showCancelModal}
          setModalPopUp={setShowCancelModal}
          showActionBtns={false}
          isArchived={true}
          archived={() => navigate(-2)}
          acceptBtnTitle="Ok"
          rejectBtnTitle="Cancel"
        />
      </div>
    </div>
  );
};

export default ProspectsCreateMessage;
