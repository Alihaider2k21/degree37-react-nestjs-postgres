// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { API } from '../../../../api/api-routes';
import SuccessIcon from '../../../../assets/success.svg';
import FormInput from '../../form/FormInput';
import FormToggle from '../../form/FormToggle';
import SelectDropdown from '../../selectDropdown';
import CancelModalPopUp from '../../cancelModal';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

import './index.scss';
import FormFooter from '../../FormFooter';

const initialErrors = {
  note_name: '',
  category_id: '',
  sub_category_id: '',
};

export default function NotesCreate({
  noteable_type,
  categories,
  subCategories,
  notesListPath,
}) {
  const params = useParams();
  const id =
    noteable_type == 'donors'
      ? params?.donorId
      : params.id || params.volunteerId;
  console.log('id', id, params);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [closeModal, setCloseModal] = useState(false);

  const [notesAddData, setNotesAddData] = useState({
    note_name: '',
    category_id: null,
    sub_category_id: null,
    details: '',
    is_active: true, // Assuming status is a boolean
    noteable_id: +id,
    noteable_type,
  });
  const [createdNote, setCreatedNote] = useState(false); //mod
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const navigate = useNavigate();
  let isDisabled =
    notesAddData.note_name &&
    notesAddData.note_name.length <= 60 &&
    notesAddData?.note_name?.length > 1 &&
    notesAddData.category_id &&
    notesAddData.sub_category_id &&
    !errors.note_name &&
    !errors.category_id &&
    !errors.sub_category_id;
  isDisabled = Boolean(isDisabled);

  useEffect(() => {
    arrangeCategory(categories, 'category');
  }, [categories]);
  useEffect(() => {
    arrangeCategory(subCategories, 'subCategory');
  }, [subCategories]);

  const arrangeCategory = (data, type) => {
    const outputDataArray = [];
    for (const inputData of data) {
      const outputData = {
        id: inputData?.id,
        value: inputData?.name,
        label: inputData?.name,
        parent_id: inputData?.parent_id?.id,
      };

      outputDataArray.push(outputData);
    }
    if (type === 'subCategory') {
      // outputDataArray.unshift({
      //   value: 'SubCategory',
      //   label: 'SubCategory',
      // });
      setSubCategoryData(outputDataArray);
    } else {
      setCategoryData(outputDataArray);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Collect and use the data for submission
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
        note_name: notesAddData?.note_name,
        category_id: +notesAddData?.category_id?.id,
        sub_category_id: +notesAddData?.sub_category_id?.id,
        details: notesAddData?.details,
        is_active: notesAddData.is_active, // Assuming status is a boolean
        noteable_id: +id,
        noteable_type: notesAddData.noteable_type,
      };
      try {
        setLoading(true);
        const res = await API.crm.documents.notes.createNote(body);
        setLoading(false);
        if (res?.data?.status === 'success') {
          setCreatedNote(true);
        } else if (res?.data?.status !== 'success') {
          const showMessage = Array.isArray(res?.data?.message)
            ? res?.data?.response[0]
            : res?.data?.response;
          toast.error(`${showMessage}`, { autoClose: 3000 });
        }
      } catch (error) {
        setLoading(false);

        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
      setLoading(false);
    }
    console.log('Form data submitted:', notesAddData);
    // You can send the data to an API or perform any other necessary actions here.
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    // Update the state based on the type of input element
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

  return (
    <>
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={notesListPath}
      />
      <section className={`popup full-section ${createdNote ? 'active' : ''}`}>
        <div className="popup-inner">
          <div className="icon">
            <img className="bg-light" src={SuccessIcon} alt="SuccessIcon" />
          </div>
          <div className="content">
            <h3>Success!</h3>
            <p>Note created.</p>
            <div className="buttons  ">
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  setCreatedNote(true);
                  navigate(notesListPath);
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
          <h5>Add Note</h5>
          <FormInput
            label="Name"
            name="note_name"
            type="text"
            displayName="Note Name"
            value={notesAddData.note_name}
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
            // defaultValue={categoryData.find(
            //   (option) => option.value === 'option1'
            // )}
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
            onFocus={() => {
              setErrors((prevErrors) => ({
                ...prevErrors,
                sub_category_id: '',
              }));
            }}
            onChange={(selectedOption) => {
              // Update the selected value in the state
              setNotesAddData({
                ...notesAddData,
                sub_category_id: selectedOption,
              });
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
            error={!notesAddData?.category_id ? '' : errors.sub_category_id}
            onBlur={(e) => handleInputBlur(e, 'sub_category_id')}
          />
          {console.log(subCategoryData)}
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

          <FormToggle
            name="is_active"
            displayName={notesAddData.is_active ? 'Active' : 'Inactive'}
            checked={notesAddData.is_active}
            classes={{ root: 'pt-2' }}
            handleChange={handleChange}
          />
        </div>
        <FormFooter
          enableCancel={true}
          onClickCancel={setCloseModal}
          enableCreate={true}
          onClickCreate={handleSubmit}
          disabled={loading}
        />
      </form>
    </>
  );
}
