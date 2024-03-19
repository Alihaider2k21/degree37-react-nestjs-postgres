import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../../styles/Global/Global.scss';
import '../../../styles/Global/Variable.scss';
import SvgComponent from '../../common/SvgComponent';

const AccountViewNavigationTabs = ({ editIcon }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, account_id, blueprintId } = useParams();
  const currentLocation = location.pathname;
  return (
    <div className="filterBar p-0 mt-4 mb-3">
      <div className="flex justify-content-between tabs mb-0 position-relative">
        <div className="tabs border-0 mb-0">
          <ul>
            <li>
              <Link
                to={`/crm/accounts/${account_id ?? id}/view/about`}
                className={
                  currentLocation ===
                  `/crm/accounts/${account_id ?? id}/view/about`
                    ? 'active'
                    : 'fw-medium'
                }
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to={`/crm/accounts/${account_id ?? id}/blueprint`}
                className={
                  currentLocation ===
                  `/crm/accounts/${account_id ?? id}/blueprints/${id}/about`
                    ? 'active'
                    : `/crm/accounts/${account_id ?? id}/blueprint` ===
                      currentLocation
                    ? 'active'
                    : currentLocation ===
                      `/crm/accounts/${
                        account_id ?? id
                      }/blueprint/${blueprintId}/shifts/view`
                    ? 'active'
                    : currentLocation ===
                      `/crm/accounts/${account_id}/blueprint/${id}/marketing-details`
                    ? 'active'
                    : 'fw-medium'
                }
              >
                Blueprints
              </Link>
            </li>
            <li>
              <Link
                to={`/crm/accounts/${account_id ?? id}/tasks`}
                className={
                  currentLocation ===
                    `/crm/accounts/${account_id ?? id}/tasks` ||
                  currentLocation ===
                    `/crm/accounts/${account_id ?? id}/tasks/${id}/view`
                    ? 'active'
                    : 'fw-medium'
                }
              >
                Tasks
              </Link>
            </li>
            <li>
              <Link
                to={`/crm/accounts/${account_id ?? id}/view/documents/notes`}
                className={
                  currentLocation.includes('documents') ? 'active' : 'fw-medium'
                }
              >
                Documents
              </Link>
            </li>
            <li>
              <Link
                to={`/crm/accounts/${account_id ?? id}/view/drive-history`}
                className={
                  currentLocation ===
                  `/crm/accounts/${account_id ?? id}/view/drive-history`
                    ? 'active'
                    : 'fw-medium'
                }
              >
                Drive History
              </Link>
            </li>
            <li>
              <Link
                to={`/crm/accounts/${account_id ?? id}/view/duplicates`}
                className={
                  currentLocation ===
                  `/crm/accounts/${account_id ?? id}/view/duplicates`
                    ? 'active'
                    : 'fw-medium'
                }
              >
                Duplicates
              </Link>
            </li>
          </ul>
        </div>
        {editIcon ? (
          <div className="d-flex mb-1 align-items-center">
            <div className="buttons me-3 mb-1">
              <Link
                to={`/operations-center/operations/drives/${id}/edit`}
                className="d-flex justify-content-center align-items-center"
              >
                <span className="icon">
                  <SvgComponent name="EditIcon" />
                </span>
                <p
                  className="text p-0 m-0"
                  style={{
                    fontSize: '14px',
                    color: '#387de5',
                    fontWeight: 400,
                    transition: 'inherit',
                  }}
                >
                  Edit Blueprint
                </p>
              </Link>
            </div>

            <div className="buttons" style={{ marginTop: '-2%' }}>
              <button
                onClick={() =>
                  navigate('/operations-center/operations/drives/create')
                }
                className="btn btn-primary"
              >
                Schedule Drive
              </button>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default AccountViewNavigationTabs;
