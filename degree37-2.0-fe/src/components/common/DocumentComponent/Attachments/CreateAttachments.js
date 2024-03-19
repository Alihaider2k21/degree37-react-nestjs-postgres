import React, { useState, useEffect } from 'react';
import FormInput from '../../form/FormInput';
import SelectDropdown from '../../selectDropdown';
import FormText from '../../form/FormText';
import { useNavigate, useParams } from 'react-router';
import './index.scss';
import AWS from 'aws-sdk';
import { toast } from 'react-toastify';
import SuccessIcon from '../../../../assets/success.svg';
import SvgComponent from '../../SvgComponent';
import CancelModalPopUp from '../../cancelModal';

const initialErrors = {
  name: '',
  category_id: '',
  sub_category_id: '',
};

export default function CreateAttachments({
  type,
  categoryApi,
  subCategoryApi,
  listLink,
  submitApi,
}) {
  const params = useParams();
  const id =
    type === 'donors' ? params.donorId : params.id || params.volunteerId;
  const navigate = useNavigate();
  const [createdAttachment, setCtreatedAttachment] = useState(false); //mod
  const [closeModal, setCloseModal] = useState(false);
  const [attachmentsAddData, setAttachmentsAddData] = useState({
    name: '',
    category_id: null,
    sub_category_id: null,
    description: '',
    attachmentable_type: type,
  });
  const [uploadFiles, setUploadFiles] = useState([]);
  const [errors, setErrors] = useState(initialErrors);
  // const [loadFileError, setLoadFileerror] = useState(false);
  const [subcategoryOption, setSubCategoryOption] = useState();
  const [categoryOption, setCategoryOption] = useState();
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);

  let isDisabled =
    attachmentsAddData.name &&
    attachmentsAddData.name.length <= 60 &&
    attachmentsAddData.category_id &&
    attachmentsAddData.sub_category_id &&
    !errors.name &&
    !errors.category_id &&
    !errors.sub_category_id &&
    !errors.description;
  isDisabled = Boolean(isDisabled);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await categoryApi;
        const categoryData = categoryResponse?.data?.data?.data;
        const categoryOptions = categoryData.map((inputData) => ({
          id: inputData?.id,
          name: inputData?.name,
        }));
        setCategoryOption(categoryOptions);

        const subCategoryResponse = await subCategoryApi;
        const subCategoryData = subCategoryResponse?.data?.data?.data;
        const subCategoryOptions = subCategoryData.map((inputData) => ({
          id: inputData?.id,
          name: inputData?.name,
          parent_id: inputData?.parent_id.id,
        }));
        setSubCategoryOption(subCategoryOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Update the state based on the type of input element
    setAttachmentsAddData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    handleInputBlur(event);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Collect and use the data for submission
    if (!attachmentsAddData?.name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Name is required.',
      }));
    } else if (attachmentsAddData?.name.length > 60) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Name must not be greater than 60 characters.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: '',
      }));
    }
    if (!attachmentsAddData?.category_id?.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        category_id: 'Please select a category.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        category_id: '',
      }));
    }
    if (!attachmentsAddData?.sub_category_id?.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sub_category_id: 'Please select a subcategory.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sub_category_id: '',
      }));
    }
    if (attachmentsAddData.description?.length > 500) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: 'Description must not be greater than 500 characters.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: '',
      }));
    }
    if (
      attachmentsAddData?.sub_category_id?.value &&
      attachmentsAddData?.category_id?.value &&
      attachmentsAddData?.name &&
      attachmentsAddData.description?.length < 500
    ) {
      setLoading(true);
      const body = {
        ...attachmentsAddData,
        // name: attachmentsAddData?.name,
        category_id: +attachmentsAddData?.category_id?.value,
        sub_category_id: +attachmentsAddData?.sub_category_id?.value,
        attachment_files: uploadFiles,
      };
      try {
        const response = await submitApi(id, type, body);
        let data = await response.data;
        setLoading(false);

        if (data?.status === 'error') {
          toast.error(data?.response);
          return;
        }
        if (data?.status === 'success') {
          setCtreatedAttachment(true);
        } else if (data?.status !== 'success') {
          const showMessage = Array.isArray(data?.message)
            ? data?.response[0]
            : data?.response;
          toast.error(`${showMessage}`, { autoClose: 3000 });
        }
      } catch (error) {
        setLoading(false);

        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
    console.log('Form data submitted:', attachmentsAddData);
    // You can send the data to an API or perform any other necessary actions here.
  };

  const handleCategoryChange = (val) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      category_id: '',
    }));
    setAttachmentsAddData({
      ...attachmentsAddData,
      category_id: val,
      sub_category_id: null,
    });
  };

  const handleSubCategoryChange = (val) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      sub_category_id: '',
    }));
    setAttachmentsAddData({
      ...attachmentsAddData,
      sub_category_id: val,
    });
  };
  const handleCategoryChangeFocus = (e) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      category_id: '',
    }));
  };

  const handleSubcategoryChangeFocus = () => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      sub_category_id: '',
    }));
  };

  const handleInputBlur = (e, nameSelect) => {
    const { name, value } = e.target;

    // Handle specific field validations based on the field name.
    switch (name || nameSelect) {
      case 'name':
        if (!value || !value.trim()) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Name is required.',
          }));
        } else if (value.length > 60) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            name: 'Name must not be greater than 60 characters.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
          }));
        }
        break;
      case 'category_id':
        if (!attachmentsAddData.category_id) {
          // console.log('caeg');
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: 'Please select a category.',
          }));
          setAttachmentsAddData({
            ...attachmentsAddData,
            sub_category_id: null,
          });
          // setErrors((prev)=>{})
        } else {
          // console.log('caeg');
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: '',
          }));
          // setErrors((prev)=>{})
        }
        // Perform validation for 'category_id' field.
        // Update 'errorMessage' if validation fails.
        break;
      case 'sub_category_id':
        if (!attachmentsAddData.sub_category_id) {
          // console.log('caeg');
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: 'Please select a subcategory.',
          }));
          // setErrors((prev)=>{})
        } else {
          // console.log('caeg');
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: '',
          }));
          // setErrors((prev)=>{})
        }
        break;
      case 'description':
        if (value.length > 500) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Description must not be greater than 500 characters.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
          }));
        }
        break;

      default:
    }
  };

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const files = event.target.files;
    setErrors((prevErrors) => ({
      ...prevErrors,
      attachment_files: null,
    }));
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf'
      ) {
        //ok
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          attachment_files: 'Only images and pdfs are allowed.',
        }));
        console.log(file.type, 'error');
        return;
      }
    }
    setLoader(true);
    if (files.length === 0) {
      return;
    }

    const s3 = new AWS.S3();

    try {
      const uploadedFileUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await readFileAsync(file);
        const fileName = `${Date.now()}-${file.name}`;
        const fileType = file.type;

        const params = {
          Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ACL: 'public-read',
          ContentType: fileType,
        };

        const result = await s3.upload(params).promise();

        // Get the URL of the uploaded file
        const fileUrl = result.Location;
        uploadedFileUrls.push(fileUrl);
      }
      setUploadFiles((prev) => [...prev, ...uploadedFileUrls]);
      setLoader(false);
      // toast.success('Files uploaded on aws.');
      // alert('Files uploaded.');

      // Do something with the uploaded file URLs in your React component
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <form className="mt-5 pt-5" onSubmit={handleSubmit}>
      <div className="formGroup">
        <h5>Add Attachment</h5>
        <div className="p-0 m-0 w-100">
          <FormInput
            label="Name"
            name="name"
            displayName="Name"
            value={attachmentsAddData.name}
            onChange={(e) => {
              if (/^[A-Za-z\s]+$/.test(e.target.value) || !e.target.value) {
                handleChange(e);
              }
            }}
            required
            error={errors.name}
            onBlur={handleInputBlur}
          />
        </div>

        <SelectDropdown
          placeholder="Category*"
          name="category_id"
          selectedValue={attachmentsAddData.category_id}
          defaultValue={attachmentsAddData.category_id}
          required
          removeDivider
          // removeTheClearCross
          showLabel
          onBlur={(e) => handleInputBlur(e, 'category_id')}
          onChange={handleCategoryChange}
          onFocus={handleCategoryChangeFocus}
          options={categoryOption?.map((categoryOption) => {
            return {
              value: categoryOption.id,
              label: categoryOption.name,
            };
          })}
          error={errors.category_id}
        />
        {console.log(attachmentsAddData, subcategoryOption)}
        <SelectDropdown
          placeholder={'Subcategory*'}
          name="sub_category_id"
          showLabel
          required
          onBlur={(e) => handleInputBlur(e, 'sub_category_id')}
          selectedValue={attachmentsAddData.sub_category_id}
          defaultValue={attachmentsAddData.sub_category_id}
          removeDivider
          // removeTheClearCross
          onChange={handleSubCategoryChange}
          options={subcategoryOption
            ?.filter(
              (el) => el.parent_id == attachmentsAddData.category_id?.value
            )
            .map((subcategoryOption) => {
              return {
                value: subcategoryOption.id,
                label: subcategoryOption.name,
              };
            })}
          disabled={
            subcategoryOption?.filter(
              (el) => el.parent_id == attachmentsAddData.category_id?.value
            ).length === 0
          }
          error={!attachmentsAddData.category_id ? '' : errors.sub_category_id}
          onFocus={handleSubcategoryChangeFocus}
        />
        <FormText
          label="description"
          name="description"
          classes={{ root: 'w-100' }}
          displayName="Description"
          value={attachmentsAddData.description}
          onChange={handleChange}
          required={false}
          error={errors.description}
          onBlur={handleInputBlur}
        />

        {loader ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <>
            <div className="w-100">
              <div className="upload-btn-wrapper">
                <button className="" disabled={loader}>
                  Upload File
                </button>
                <input
                  type="file"
                  name="myfile"
                  // onBlur={handleInputBlur}
                  // onClick={() => setLoadFileerror(true)}
                  accept=".pdf, .jpg, .png, .jpeg"
                  multiple
                  required
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            <div className="form-field w-100">
              <div className="field">
                <p className="mb-3 mt-2">
                  You can upload multiple files at once.
                </p>
                {errors.attachment_files && (
                  <div className="error">
                    <p>{errors.attachment_files}</p>
                  </div>
                )}
                <div
                  style={{
                    wordBreak: 'break-word',
                  }}
                  className="d-flex flex-wrap "
                >
                  {uploadFiles?.length > 0 &&
                    uploadFiles.map((file, index) => (
                      <span
                        style={{
                          color: '#2D2D2E',
                          backgroundColor: '#f5f5f5',
                          fontSize: '14px',
                          padding: '18px 8px 18px 15px',
                          borderLeft: '2px solid #72A3D0',
                          borderRadius: '8px',
                          gap: '20px',
                        }}
                        className=" mt-1 me-3 "
                        key={index}
                      >
                        <span>
                          {file?.includes('.pdf') ? (
                            <SvgComponent name="PdfIcon" />
                          ) : file.includes('.jpg') ||
                            file.includes('.jpeg') ||
                            file.includes('.png') ? (
                            <SvgComponent name="image" />
                          ) : null}
                        </span>
                        <span className="ms-1">{file?.split('/').pop()}</span>
                        <span
                          className="ms-1"
                          onClick={() => {
                            uploadFiles.splice(index, 1);
                            // Now, you can set the modified array to uploadFiles
                            setUploadFiles([...uploadFiles]);
                          }}
                        >
                          <SvgComponent name="AwsCrossIcon" />
                        </span>
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={`form_footer`}>
        <div></div>
        <div>
          <CancelModalPopUp
            title="Confirmation"
            message="Unsaved changes will be lost, do you wish to proceed?"
            modalPopUp={closeModal}
            isNavigate={true}
            setModalPopUp={setCloseModal}
            redirectPath={listLink}
          />
          <span
            className={`text-primary border-0 cursor-pointer cancel`}
            onClick={() => setCloseModal(true)}
          >
            Cancel
          </span>
          <button
            type="button"
            className={`rounded  ${
              !isDisabled ? `btn btn-primary py-0` : `btn btn-primary py-0 `
            }`}
            onClick={handleSubmit}
            disabled={loading || loader}
          >
            Create
          </button>
        </div>
      </div>
      {/* <SuccessPopUpModal
        title="Success!"
        message={'Attachment created.'}
        modalPopUp={createdAttachment}
        // isNavigate={eventName !== 'saveClose' ? true : false}
        setModalPopUp={setCtreatedAttachment}
        showActionBtns={true}
        redirectPath={listLink}
      /> */}
      <section
        className={`popup full-section ${createdAttachment ? 'active' : ''}`}
      >
        <div className="popup-inner">
          <div className="icon">
            <img className="bg-light" src={SuccessIcon} alt="SuccessIcon" />
          </div>
          <div className="content">
            <h3>Success!</h3>
            <p>Attachment created.</p>
            <div className="buttons  ">
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  setCtreatedAttachment(true);
                  navigate(listLink);
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}
