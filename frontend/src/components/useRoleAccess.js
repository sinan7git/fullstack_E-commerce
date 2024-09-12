import { useContext } from 'react';
import { UserContext } from '../App';
import jwt_decode from 'jwt-decode';

const useRoleAccess = (allowedRoles) => {
  const { userData } = useContext(UserContext);

  if (!userData || !userData.access) {
    return false;
  }

  const decodedToken = jwt_decode(userData.access);
  const userRole = decodedToken.user_type;

  return allowedRoles.includes(userRole);
};

export default useRoleAccess;