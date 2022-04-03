import NewNav from 'Components/Main/NewNav';

import UserLostPetBoardList from 'Components/UserManagement/UserLostPetBoardList';
import UserManageSidebar from 'Components/UserManagement/UserManageSidebar';
import { useParams } from 'react-router-dom';

function PageUserLostPetBoardList() {
  const { userId } = useParams();

  return (
    <>
      <NewNav />
      <div className="flex">
        <div className="flex-none">
          <UserManageSidebar userId={userId} />
        </div>

        <div className="flex-1">
          <UserLostPetBoardList userId={userId} />
        </div>
      </div>
    </>
  );
}

export default PageUserLostPetBoardList;
