import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import SvgComponent from '../../../../../common/SvgComponent';
import Pagination from '../../../../../common/pagination/index';
import PopUpModal from '../../../../../common/PopUpModal';
import { toast } from 'react-toastify';
import { makeRequest } from '../../../../../../utils';
import { LocationAttachmentCategoriesNavigation } from './location-attachment-categories-navigationtabs';

const ListCategories = () => {
  const bearerToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [categoryId, setCategoryId] = useState(0);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [categories, setCategories] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const BreadcrumbsData = [
    { label: 'System Configuration', class: 'disable-label', link: '/' },
    {
      label: 'CRM Administration',
      class: 'disable-label',
      link: '/',
    },
    {
      label: 'Location',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'Attachment Categories',
      class: 'active-label',
      link: '#',
    },
  ];

  const getCategoryData = async () => {
    const result = await makeRequest(
      `${BASE_URL}/location/attachment-category?page=${currentPage}&name=${searchText}&limit=${limit}&status=${isActive}`,
      'GET'
    );
    if (result.ok || result.status === 200) {
      setCategories(result?.data);
      setTotalRecords(result?.count);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };
  useEffect(() => {
    getCategoryData();
    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [currentPage, limit, searchText, BASE_URL, isActive]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/crm-admin/location/attachment-categories/create'
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleIsActive = (event) => {
    setIsActive(event.target.value);
  };
  // Archieve
  const archiveCategory = async () => {
    try {
      const result = await fetch(
        `${BASE_URL}/location/attachment-category/${categoryId}`,
        {
          method: 'Delete',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      let { data, status, response } = await result.json();

      if (status === 'success') {
        // Handle successful response
        toast.success(response, { autoClose: 3000 });
        setModalPopUp(false);
        await getCategoryData();
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        // Handle bad request
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const sortedCategories = useMemo(() => {
    if (!categories?.length) return;
    const sorted = [...categories];

    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sorted;
  }, [categories, sortBy, sortOrder]);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Attachment Categories'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <LocationAttachmentCategoriesNavigation />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter w-50">
            <form className="d-flex">
              <div className="form-field w-100">
                <select
                  onChange={handleIsActive}
                  name="is-active"
                  id="is-active"
                >
                  <option disabled selected value="">
                    Status
                  </option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        <div className="buttons">
          <button className="btn btn-primary" onClick={handleAddClick}>
            Create Category
          </button>
        </div>

        <div className="table-listing-main">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>
                    Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>

                  <th>
                    Description
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('description')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>

                  <th>
                    Status
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('is_active')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories?.length
                  ? sortedCategories?.map((category) => {
                      return (
                        <tr key={category.id}>
                          <td>{category.name}</td>

                          <td>{category.description}</td>
                          {/* <td>{category.category_type_id.name}</td> */}

                          <td>
                            {category.isActive ? (
                              <span className="badge active">Active</span>
                            ) : (
                              <span className="badge inactive">InActive</span>
                            )}
                          </td>
                          <td className="options">
                            <div className="dropdown-center">
                              <div
                                className="optionsIcon"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <SvgComponent name={'ThreeDots'} />
                              </div>
                              <ul className="dropdown-menu">
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/system-configuration/tenant-admin/crm-admin/location/attachment-categories/${category?.id}`}
                                  >
                                    View
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/system-configuration/tenant-admin/crm-admin/location/attachment-categories/${category?.id}/edit`}
                                  >
                                    Edit
                                  </Link>
                                </li>

                                <li>
                                  <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                      setCategoryId(category.id);
                                      setModalPopUp(true);
                                    }}
                                  >
                                    Archive
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : ''}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />

        <PopUpModal
          title="Confirmation"
          message="Are you sure you want to archive?"
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={true}
          confirmAction={archiveCategory}
        />
      </div>
    </div>
  );
};

export default ListCategories;
