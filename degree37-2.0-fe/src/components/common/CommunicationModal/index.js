import React, { useEffect, useState } from 'react';
import Mystyles from './index.module.scss';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import SuccessPopUpModal from '../successModal';
import SelectDropdown from '../selectDropdown';
import FormInput from '../form/FormInput';
import { toast } from 'react-toastify';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';

const CommunicationModal = ({
  openModal,
  handleModalButtons,
  communicationable_id,
  communicationable_type,
  setRefreshData,
}) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [text, setText] = useState('');
  const [textError, setTextError] = useState('');
  const [defaultMessageType, setDefaultMessageType] = useState('email');
  const [showCancelModal, setShowCancelModal] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState('');
  const [templateData, setTemplateData] = useState([]);
  const [template, setTemplate] = useState(null);
  const [templateError, setTemplateError] = useState('');
  const [subject, setSubject] = useState(null);
  const [subjectError, setSubjectError] = useState('');
  const [editor, setEditor] = useState('');
  const [editorError, setEditorError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const maxCharacters = 160;

  const handleChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= maxCharacters) {
      setText(inputText);
    }
  };

  const cancelPressedHandler = () => {
    if (text?.length > 0 || getTextValue()?.length > 0 || subject || template) {
      setShowCancelModal(true);
    } else {
      handleModalButtons(false);
      setText('');
      setEditorState(EditorState.createEmpty());
      setTemplate(null);
      setSubject('');
      setTextError('');
      setTemplateError('');
      setSubjectError('');
      setEditorError('');
    }
  };

  const getTextValue = () => {
    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText();
    return text;
  };

  const getTemplates = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/contacts/volunteers/communications/email-templates?campaignId=1549`
      );
      const data = await response.json();
      if (data.status !== 500) {
        setTemplateData(data?.Response?.emails);
      }
    } catch (error) {
      toast.error(`Failed to fetch Email Templates ${error}`, {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isFormValid = true;
    if (defaultMessageType === 'email') {
      if (!template) {
        setTemplateError('Email template is required.');
        isFormValid = false;
      } else {
        setTemplateError('');
      }
      if (!subject) {
        setSubjectError('Subject is required.');
        isFormValid = false;
      } else {
        setSubjectError('');
      }
      if (!editor || getTextValue()?.length === 0) {
        setEditorError('Content is required.');
        isFormValid = false;
      } else {
        setEditorError('');
      }
    } else {
      if (!text) {
        setTextError('Message is required.');
        isFormValid = false;
      } else {
        setTextError('');
      }
    }

    if (isFormValid && defaultMessageType === 'email') {
      setIsSending(true);
      const body = {
        communicationable_id: communicationable_id,
        communicationable_type: communicationable_type,
        date: new Date(),
        message_type: defaultMessageType,
        subject: defaultMessageType === 'email' ? subject : '',
        message_text: defaultMessageType === 'email' ? editor : text,
        template_id: template?.value,
        status: 'in_progress',
      };
      try {
        const response = await makeAuthorizedApiRequest(
          'POST',
          `${BASE_URL}/contacts/volunteers/communications`,
          JSON.stringify(body)
        );
        if (!response.ok) {
          // Handle non-successful response (e.g., show an error message)
          const errorData = await response.json();
          const errorMessage = Array.isArray(errorData?.message)
            ? errorData?.message[0]
            : errorData?.message;
          toast.error(`${errorMessage}`, { autoClose: 3000 });
          setIsSending(false);
          return; // Exit the function on error
        }
        const data = await response.json();
        if (data?.status_code === 201) {
          // Handle successful response
          setShowSuccessModal(true);
          handleModalButtons(false);
          setText('');
          setEditorState(EditorState.createEmpty());
          setDefaultMessageType('email');
          setEditor('');
          setSubject('');
          setTemplate(null);
          setRefreshData((prevState) => !prevState);
          setIsSending(false);
        } else {
          // Handle other response status codes (if needed)
          const showMessage = Array.isArray(data?.message)
            ? data?.message[0]
            : data?.message;
          toast.error(`${showMessage}`, { autoClose: 3000 });
          setIsSending(false);
        }
      } catch (error) {
        console.error('API request error:', error);
        toast.error(`${error?.message}`, { autoClose: 3000 });
        setIsSending(false);
      }
    }
  };

  if (!openModal) return null;
  return (
    <>
      <section
        className={`${Mystyles.CreateMessageModal} popup full-section active`}
      >
        <div className={`${Mystyles.MessageModalInner} popup-inner`}>
          <div className={`${Mystyles.MessageModalContent} content`}>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <h5>Send {defaultMessageType === 'sms' ? 'SMS' : 'Email'}</h5>
                <div className="form-field w-100">
                  <p className="radio-label">
                    <input
                      type="radio"
                      name="message_type"
                      id="email"
                      className="form-check-input contact-radio"
                      checked={defaultMessageType === 'email'}
                      onChange={() => setDefaultMessageType('email')}
                    />{' '}
                    Email
                  </p>
                  <p className="radio-label">
                    <input
                      type="radio"
                      name="message_type"
                      id="sms"
                      className="form-check-input contact-radio"
                      checked={defaultMessageType === 'sms'}
                      onChange={() => setDefaultMessageType('sms')}
                    />{' '}
                    SMS
                  </p>
                </div>
                {defaultMessageType === 'email' ? (
                  <>
                    <SelectDropdown
                      placeholder={'Select Template'}
                      defaultValue={template}
                      selectedValue={template}
                      onChange={setTemplate}
                      removeDivider
                      showLabel
                      options={templateData?.map((templateItem) => {
                        return {
                          value: templateItem.emailId,
                          label: templateItem.name,
                        };
                      })}
                      error={templateError && templateError}
                    />
                    <FormInput
                      name="subject"
                      displayName="Subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required={false}
                      error={subjectError && subjectError}
                    />
                    <div className="form-field editor w-100">
                      <div className="field">
                        {/* whoever worked on this component didn't properly handle the editor, which is why tab navigation is not functioning correctly.
                       For now, this module is static, so I'm commenting out this editor.     */}
                        <Editor
                          editorState={editorState}
                          onEditorStateChange={setEditorState}
                          onChange={(state) => {
                            const contentAsHTML = draftToHtml(state);
                            setEditor(contentAsHTML);
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
                                8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48,
                                60, 72, 96,
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
                                'Code',
                              ],
                            },
                            link: {
                              options: ['link'],
                            },
                          }}
                        />
                      </div>
                      {editorError && (
                        <div className="error">
                          <p className="error">{editorError}</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="form-field textarea w-100">
                    <div className="field">
                      <textarea
                        type="text"
                        value={text}
                        onChange={handleChange}
                        className="form-control textarea"
                        placeholder="Type your message here."
                        name="description"
                      />
                    </div>
                    {textError && (
                      <div className="error">
                        <p className="error">{textError}</p>
                      </div>
                    )}
                    <div className="length">
                      <span>{text.length}</span>
                      <span className="seperator">/</span>
                      <span>{maxCharacters}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={cancelPressedHandler}
                  disabled={isSending}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  disabled={isSending}
                  type="submit"
                >
                  Send
                </button>
              </div>
            </form>
            <SuccessPopUpModal
              title="Confirmation"
              message={'Unsaved changes will be lost. Do you want to continue?'}
              modalPopUp={showCancelModal}
              setModalPopUp={setShowCancelModal}
              showActionBtns={false}
              isArchived={true}
              acceptBtnTitle="Ok"
              rejectBtnTitle="Cancel"
              archived={() => {
                handleModalButtons(false);
                setShowCancelModal(false);
                setText('');
                setEditorState(EditorState.createEmpty());
                setSubject('');
                setTemplate(null);
                setTextError('');
                setTemplateError('');
                setSubjectError('');
                setEditorError('');
              }}
            />
            <SuccessPopUpModal
              title={'Success!'}
              message={`${
                defaultMessageType === 'email' ? 'Email' : 'Sms'
              } sent successfully.`}
              modalPopUp={showSuccessModal}
              setModalPopUp={setShowSuccessModal}
              showActionBtns={true}
              isArchived={false}
              acceptBtnTitle="Ok"
              rejectBtnTitle="Cancel"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default CommunicationModal;
