// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../api/api-routes';
import ArchiveImage from '../../../../assets/archive.svg';
import SuccessIcon from '../../../../assets/success.svg';
import FormInput from '../../form/FormInput';
import FormToggle from '../../form/FormToggle';
import SelectDropdown from '../../selectDropdown';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import CancelModalPopUp from '../../cancelModal';
import SuccessPopUpModal from '../../successModal';
import FormFooter from '../../FormFooter';

const initialErrors = {
  note_name: '',
  category_id: '',
  sub_category_id: '',
};

export default function EditNotes({
  noteable_type,
  categories,
  subCategories,
  notesListPath,
}) {
  const params = useParams();
  const noteId = params.noteId;
  const id =
    noteable_type === 'donors'
      ? params?.donorId
      : params.id || params.volunteerId;
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [notesAddData, setNotesAddData] = useState({
    id: +noteId,
    note_name: '',
    category_id: null,
    sub_category_id: null,
    details: '',
    is_active: true, // Assuming status is a boolean
    noteable_id: +id,
    noteable_type,
  });
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [showUpdatedNote, setShowUpdatedNote] = useState(false);
  const [showConfirmationDialogArchive, setShowConfirmationDialogArchive] =
    useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    arrangeCategory(categories, 'category');
  }, [categories]);
  useEffect(() => {
    arrangeCategory(subCategories, 'subCategory');
  }, [subCategories]);

  useEffect(() => {
    getEdit();
  }, []);

  const arrangeCategory = (data, type) => {
    const outputDataArray = [];
    for (const inputData of data) {
      const outputData = {
        id: inputData?.id,
        value: inputData?.name,
        label: inputData?.name,
        parent_id: inputData.parent_id?.id,
      };

      outputDataArray.push(outputData);
    }
    if (type === 'subCategory') {
      setSubCategoryData(outputDataArray);
    } else {
      setCategoryData(outputDataArray);
    }
  };
  const getEdit = async () => {
    try {
      const response = await API.crm.documents.notes.getNoteByID(noteId);

      const notes = response?.data?.data;
      setNotesAddData({
        ...notes,
        category_id: {
          ...notes.category_id,
          value: notes.category_id.name,
          label: notes.category_id.name,
        },
        sub_category_id: {
          ...notes.sub_category_id,
          value: notes.sub_category_id.name,
          label: notes.sub_category_id.name,
        },
      });
      const contentBlock = htmlToDraft(notes.details);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  const [errors, setErrors] = useState(initialErrors);

  let isDisabled =
    notesAddData?.note_name &&
    notesAddData.note_name.length <= 60 &&
    notesAddData?.note_name?.length > 1 &&
    notesAddData?.category_id &&
    notesAddData?.sub_category_id &&
    !errors?.note_name &&
    !errors?.category_id &&
    !errors?.sub_category_id;
  isDisabled = Boolean(isDisabled);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!notesAddData?.note_name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        note_name: 'Note Name is required.',
      }));
    }

    if (notesAddData?.note_name && notesAddData?.note_name?.length < 2) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        note_name: 'Minimum 2 char required.',
      }));
    }

    if (!notesAddData?.category_id) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        category_id: 'Please select a category.',
      }));
    }
    if (!notesAddData?.sub_category_id) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sub_category_id: 'Please select a subcategory.',
      }));
    }
    if (isDisabled) {
      const body = {
        id: +noteId,
        note_name: notesAddData?.note_name,
        category_id: +notesAddData?.category_id.id,
        sub_category_id: +notesAddData?.sub_category_id.id,
        details: notesAddData?.details,
        is_active: notesAddData?.is_active,
        noteable_id: +id,
        noteable_type: notesAddData.noteable_type,
      };
      setLoading(true);
      try {
        await API.crm.documents.notes.updateNote(noteId, body);
        setLoading(false);
        setRedirect(false);
        setShowUpdatedNote(true);
        if (event.target.innerText === 'Save & Close') {
          setRedirect(true);
        }
      } catch (error) {
        setLoading(false);

        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNotesAddData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    handleInputBlur(event);
  };

  const handleInputBlur = (e, nameSelect) => {
    const { name, value } = e.target;

    switch (nameSelect || name) {
      case 'note_name':
        if (!value || !value.trim()) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Note Name is required.',
          }));
        } else if (value.length >= 60) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            note_name: 'Name must not be greater than 60 characters.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
          }));
        }
        break;

      case 'category_id':
        if (!notesAddData.category_id) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: 'Please select a category.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: '',
          }));
        }
        break;
      case 'sub_category_id':
        if (!notesAddData.sub_category_id) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: 'Please select a subcategory.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: '',
          }));
        }
        break;
      default:
    }
  };

  const handleClickArchive = () => {
    setShowConfirmationDialogArchive(true);
  };
  const handleConfirmationResultArchive = async (confirmed) => {
    setShowConfirmationDialogArchive(false);

    if (confirmed) {
      try {
        const response = await API.crm.documents.notes.archiveNote(noteId);
        if (response?.status) {
          setShowSuccessMessage(true);
          // toast.success('Note is archived.');
        } else {
          // toast.error('Note is archived.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching user details', {
          autoClose: 3000,
        });
      }
    }
  };
  return (
    <>
      <SuccessPopUpModal
        title="Success!"
        message={'Note is archived.'}
        modalPopUp={showSuccessMessage}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
        isNavigate={true}
        redirectPath={notesListPath}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={-1}
      />
      <section
        className={`popup full-section ${
          showConfirmationDialogArchive ? 'active' : ''
        }`}
      >
        <div className="popup-inner">
          <div className="icon">
            <img src={ArchiveImage} alt="CancelIcon" />
          </div>
          <div className="content">
            <h3>Confirmation</h3>
            <p>Are you sure you want to archive?</p>
            <div className="buttons">
              <button
                className="btn btn-secondary"
                onClick={() => handleConfirmationResultArchive(false)}
              >
                No
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleConfirmationResultArchive(true)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </section>
      <section
        className={`popup full-section ${showUpdatedNote ? 'active' : ''}`}
      >
        <div className="popup-inner">
          <div className="icon">
            <img className="bg-light" src={SuccessIcon} alt="SuccessIcon" />
          </div>
          <div className="content">
            <h3>Success!</h3>
            <p>Note updated.</p>
            <div className="buttons  ">
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  setShowUpdatedNote(false);
                  if (redirect) navigate(-1);
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </section>

      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="formGroup">
          <h5>Edit Note</h5>
          <FormInput
            label="Name"
            name="note_name"
            displayName="Note Name"
            value={notesAddData?.note_name}
            onChange={(e) => {
              if (/^[A-Za-z\s]+$/.test(e.target.value) || !e.target.value) {
                handleChange(e);
              }
            }}
            required
            error={errors.note_name}
            onBlur={handleInputBlur}
          />
          <SelectDropdown
            placeholder={'Category*'}
            name="category_id"
            selectedValue={notesAddData?.category_id}
            required
            removeDivider
            // removeTheClearCross
            showLabel
            onChange={(selectedOption) => {
              // Update the selected value in the state
              setNotesAddData({
                ...notesAddData,
                category_id: selectedOption,
                sub_category_id: null,
              });
            }}
            onFocus={() => {
              setErrors((prevErrors) => ({
                ...prevErrors,
                category_id: '',
              }));
            }}
            options={categoryData}
            error={errors.category_id}
            onBlur={(e) => handleInputBlur(e, 'category_id')}
          />

          <SelectDropdown
            placeholder={'Subcategory*'}
            name="sub_category_id"
            showLabel
            required
            selectedValue={notesAddData?.sub_category_id}
            onChange={(selectedOption) => {
              // Update the selected value in the state
              setNotesAddData({
                ...notesAddData,
                sub_category_id: selectedOption,
              });
            }}
            onFocus={() => {
              setErrors((prevErrors) => ({
                ...prevErrors,
                sub_category_id: '',
              }));
            }}
            //   defaultValue={collectionOperation}
            //   selectedValue={collectionOperation}
            removeDivider
            // removeTheClearCross
            //   onChange={handleCollectionOperation}
            options={subCategoryData.filter(
              (el) => el.parent_id == notesAddData?.category_id?.id
            )}
            disabled={
              subCategoryData.filter(
                (el) => el.parent_id == notesAddData?.category_id?.id
              ).length === 0
            }
            error={errors.sub_category_id}
            onBlur={(e) => handleInputBlur(e, 'sub_category_id')}
          />

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
              onEditorStateChange={setEditorState}
              onChange={(state) => {
                const contentAsHTML = draftToHtml(state);
                setNotesAddData((prevData) => ({
                  ...prevData,
                  details: contentAsHTML,
                }));
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
                    'Code',
                  ],
                },
                link: {
                  options: ['link'],
                },
              }}
            />
          </div>

          <FormToggle
            name="is_active"
            displayName={notesAddData?.is_active ? 'Active' : 'Inactive'}
            checked={notesAddData?.is_active}
            classes={{ root: 'pt-2' }}
            handleChange={handleChange}
          />
        </div>
        <FormFooter
          enableArchive={true}
          onClickArchive={() => handleClickArchive(true)}
          enableCancel={true}
          onClickCancel={setCloseModal}
          enableSaveAndClose={true}
          onClickSaveAndClose={handleSubmit}
          enableSaveChanges={true}
          saveAndCloseType={'submit'}
          onClickSaveChanges={handleSubmit}
          disabled={loading}
        />
      </form>
    </>
  );
}
