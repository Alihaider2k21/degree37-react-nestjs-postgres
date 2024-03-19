import React, { useEffect } from 'react';
import StaffNavigation from '../../../../../components/crm/contacts/staff/StaffNavigation';
import SelectDropdown from '../../../../../components/common/selectDropdown';
import TableList from '../../../../../components/common/tableListing';
import Pagination from '../../../../../components/common/pagination/index';
import ConfirmModal from '../../../../../components/common/confirmModal';
import ConfirmArchiveIcon from '../../../../../assets/images/ConfirmArchiveIcon.png';
import styles from './index.module.scss';
import DatePicker from 'react-datepicker';
import {
  add,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { fetchData } from '../../../../../helpers/Api';
import {
  useNavigate,
  useLocation,
  useSearchParams,
  useParams,
  useOutletContext,
} from 'react-router-dom';
import { StaffBreadCrumbsData } from '../../../../../components/crm/contacts/staff/StaffBreadCrumbsData';

const initialSearchParams = {
  page: 1,
  limit: 10,
  keyword: '',
  sortOrder: 'DESC',
  sortName: 'created_at',
};

export default function ListCertification() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...StaffBreadCrumbsData,
      {
        label: 'View Staff',
        class: 'disable-label',
        link: `/crm/contacts/staff/${params?.staffId}/view`,
      },
      {
        label: 'Leave',
        class: 'disable-label',
        link: `/crm/contacts/staff/${params?.staffId}/view/leave`,
      },
    ]);
  }, []);
  const [searchParams, setSearchParams] = useSearchParams(initialSearchParams);
  const [leaves, setLeaves] = React.useState([]);
  const [totalLeaves, setTotalLeaves] = React.useState(-1);
  const [page, setPage] = React.useState(initialSearchParams.page);
  const [limit, setLimit] = React.useState(
    process.env.REACT_APP_PAGE_LIMIT || initialSearchParams.limit
  );
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [period, setPeriod] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dateCrossColor, setDateCrossColor] = React.useState('#cccccc');
  const [type, setType] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState(
    initialSearchParams.sortOrder
  );
  const [sortName, setSortName] = React.useState(initialSearchParams.sortName);
  const [showConfirmation, setConfirmation] = React.useState(null);

  const periodOptions = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'Next 2 Weeks', value: 'next_two_weeks' },
    { label: 'Past 2 Weeks', value: 'past_two_weeks' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'All Past', value: 'all_past' },
    { label: 'All Future', value: 'all_future' },
  ];

  const typeOptions = [
    { label: 'Sick', value: 'SICK' },
    { label: 'Casual', value: 'CASUAL' },
  ];

  const TableHeaders = [
    { name: 'begin_date', label: 'Begin Date', width: '10%', sortable: true },
    { name: 'end_date', label: 'End Date', width: '10%', sortable: true },
    {
      name: 'type',
      label: 'Type',
      width: '10%',
      sortable: true,
    },
    {
      name: 'hours',
      label: 'Hours',
      width: '10%',
      sortable: true,
    },
    { name: 'note', label: 'Note', width: '20%', sortable: true },
  ];

  const OptionsConfig = [
    {
      label: 'View',
      path: (rowData) => location.pathname + `/${rowData.id}/view`,
    },
    {
      label: 'Edit',
      path: (rowData) => location.pathname + `/${rowData.id}/edit`,
    },
    {
      label: 'Archive',
      action: (rowData) => setConfirmation(rowData.id),
    },
  ];

  React.useEffect(() => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      keyword: context?.search,
      sortName,
      sortOrder,
      page,
      limit,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortName, sortOrder, page, limit, context?.search]);

  React.useEffect(() => {
    const parsePeriod = (data) => {
      let begin_date = null,
        end_date = null;
      const currentDate = new Date();

      switch (data?.period) {
        case 'this_week':
          begin_date = startOfWeek(currentDate, { weekStartsOn: 2 });
          end_date = endOfWeek(currentDate, { weekStartsOn: 2 });
          break;
        case 'next_two_weeks':
          begin_date = endOfWeek(currentDate, { weekStartsOn: 2 });
          end_date = add(begin_date, { days: 14 });
          break;
        case 'past_two_weeks':
          end_date = startOfWeek(currentDate, { weekStartsOn: 2 });
          begin_date = add(end_date, { days: -14 });
          break;
        case 'this_month':
          begin_date = add(startOfMonth(currentDate), { days: 1 });
          end_date = add(endOfMonth(currentDate), { days: 1 });
          break;
        case 'last_month':
          end_date = add(startOfMonth(currentDate), { days: 1 });
          begin_date = add(end_date, { months: -1 });
          break;
        case 'all_past':
          end_date = currentDate;
          break;
        case 'all_future':
          begin_date = add(currentDate, { days: 1 });
          break;
        default:
          begin_date = currentDate;
          end_date = currentDate;
          break;
      }

      return [
        begin_date && begin_date.toISOString(),
        end_date && end_date.toISOString(),
      ];
    };

    const fetchLeaves = () => {
      const data = Object.fromEntries(searchParams);
      const payload = { ...data, staff_id: params?.staffId };
      if (startDate) {
        const sd = new Date(startDate.getTime());
        sd.setDate(sd.getDate());
        sd.setHours(5, 0, 0, 0);
        payload['begin_date'] = sd.toISOString();
      }
      if (endDate) {
        const ed = new Date(endDate.getTime());
        ed.setDate(ed.getDate() + 1);
        ed.setHours(5, 0, 0, 0);
        payload['end_date'] = ed.toISOString();
      }
      if (data?.period && data?.period !== 'all') {
        const [begin_date, end_date] = parsePeriod(data);
        if (begin_date) payload['begin_date'] = begin_date;
        if (end_date) payload['end_date'] = end_date;
      }
      setIsLoading(true);

      fetchData('/staff-leave/list', 'GET', payload)
        .then((res) => {
          setTimeout(() => {
            setLeaves(res?.data?.records || []);
            setTotalLeaves(res?.data?.count);
            setType(
              typeOptions.find((type) => type.value === data?.type) || null
            );
            setPeriod(
              periodOptions.find((status) => status.value === data?.period) ||
                null
            );
            setIsLoading(false);
          });
        })
        .catch((err) => {
          console.error(err);
          setTotalLeaves(0);
          setIsLoading(false);
        });
    };

    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.staffId, searchParams, startDate, endDate, showConfirmation]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleFilter = (option, e) => {
    const { value = '' } = option || {};
    const { name } = e;

    setTimeout(() => {
      switch (name) {
        case 'period':
          setPeriod(option);
          break;
        default:
          setType(option);
          break;
      }
      const searchObj = { ...Object.fromEntries(searchParams), [name]: value };
      if (option === null) delete searchObj[name];
      setPage(1);
      setSearchParams(searchObj);
    });
  };

  const handleSort = (columnName) => {
    setTimeout(() => {
      setSortName(columnName);
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    navigate(location.pathname + '/create');
  };

  const handleArchive = (id) => {
    fetchData(`/staff-leave/${id}/archive`, 'PATCH')
      .then((_) => setConfirmation(null))
      .catch((err) => {
        console.error(err);
        setConfirmation(null);
      });
  };

  const resetDateHandler = () => {
    setStartDate(null);
    setEndDate(null);
  };
  return (
    <>
      <StaffNavigation staff={context?.staff}>
        <form className="formGroup w-75">
          <div className="d-flex gap-4 justify-content-end">
            <div className={`${styles.fieldDate} w-60`}>
              <DatePicker
                dateFormat="MM/dd/yyyy"
                className="custom-datepicker form-control"
                autoComplete="off"
                placeholderText="Dates"
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
              />
              {startDate && (
                <span
                  className={`position-absolute ${styles.dateCross}`}
                  onClick={resetDateHandler}
                >
                  <svg
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                    className="css-tj5bde-Svg"
                    onMouseEnter={() => setDateCrossColor('#999999')}
                    onMouseLeave={() => setDateCrossColor('#cccccc')}
                  >
                    <path
                      fill={dateCrossColor}
                      d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
                    ></path>
                  </svg>
                </span>
              )}
              {startDate && <label>Dates</label>}
            </div>
            <div className={`w-50`}>
              <SelectDropdown
                name="period"
                placeholder={'Period'}
                selectedValue={period}
                onChange={handleFilter}
                options={periodOptions}
                removeDivider
                showLabel
              />
            </div>
            <div className={`w-50`}>
              <SelectDropdown
                name="type"
                placeholder={'Leave Type'}
                selectedValue={type}
                onChange={handleFilter}
                options={typeOptions}
                removeDivider
                showLabel
              />
            </div>
          </div>
        </form>
      </StaffNavigation>

      <div className="mainContentInner">
        <div className="buttons">
          <button className="btn btn-primary btn-md" onClick={handleCreate}>
            Add Leave
          </button>
        </div>

        <TableList
          isLoading={isLoading}
          data={leaves}
          headers={TableHeaders}
          handleSort={handleSort}
          optionsConfig={OptionsConfig}
        />

        <Pagination
          limit={limit}
          setLimit={(value) => setLimit(value)}
          currentPage={page}
          setCurrentPage={(value) => setPage(value)}
          totalRecords={totalLeaves}
        />
      </div>

      <ConfirmModal
        showConfirmation={showConfirmation !== null}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => handleArchive(showConfirmation)}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      />
    </>
  );
}
