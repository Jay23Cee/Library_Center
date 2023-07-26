import { User_Logout } from '../controllers/user_handler';
import { Private_Logout } from '../controllers/Private_handler';

interface LogoutProps {
  userType: string;
}

const logoutAll = async () => {

    await Private_Logout();
    await User_Logout();

};

export default logoutAll;
