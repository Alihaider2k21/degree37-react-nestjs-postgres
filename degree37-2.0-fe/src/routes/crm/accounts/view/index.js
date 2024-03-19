import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from '../../../../components/crm/accounts/about/about.js';
import AccountListTasks from '../../../../components/crm/accounts/tasks/AccountListTasks.js';
import NotesList from '../../../../components/crm/accounts/documents/notes/NotesList.js';
import AttachmentsList from '../../../../components/crm/accounts/documents/attachments/AttachmentsList.js';
import ListDuplicates from '../../../../components/crm/accounts/duplicates/DuplicatesList.js';
import DrivesHistoryList from '../../../../components/crm/accounts/drivesHistory/DrivesHistoryList.js';
import BluePrintListing from '../../../../components/crm/accounts/bluePrints/listing.js';
import ViewNotes from '../../../../pages/crm/accounts/documents/notes/ViewNotes.jsx';
import ViewAttachments from '../../../../pages/crm/accounts/documents/attachments/ViewAttachments.js';

function AccountsViewRoutes({
  accountData,
  setAccountData,
  searchText,
  setSearchText,
  viewNumbersPercentage,
  viewProductsProcedure,
}) {
  return (
    <Routes>
      <Route
        exact
        path="/view/:slug"
        element={
          <About accountData={accountData} setAccountData={setAccountData} />
        }
      />
      <Route
        exact
        path="/blueprint"
        element={<BluePrintListing search={searchText} />}
      />
      <Route
        exact
        path={'/tasks'}
        element={
          <AccountListTasks
            searchText={searchText}
            setSearchText={setSearchText}
          />
        }
      />
      <Route
        exact
        path="/view/documents/notes"
        element={<NotesList search={searchText} setSearch={setSearchText} />}
      />
      <Route
        exact
        path="/view/documents/notes/:noteId/view"
        element={<ViewNotes />}
      />
      <Route
        exact
        path="/view/documents/attachments"
        element={
          <AttachmentsList search={searchText} setSearch={setSearchText} />
        }
      />
      <Route
        exact
        path="/view/documents/attachments/:attachId/view"
        element={<ViewAttachments />}
      />
      <Route
        exact
        path="/view/drive-history"
        element={
          <DrivesHistoryList
            viewNumbersPercentage={viewNumbersPercentage}
            viewProductsProcedure={viewProductsProcedure}
          />
        }
      />
      <Route
        exact
        path="/view/duplicates"
        element={
          <ListDuplicates search={searchText} setSearch={setSearchText} />
        }
      />
    </Routes>
  );
}

export default AccountsViewRoutes;
