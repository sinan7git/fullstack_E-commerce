import { useContext } from 'react';
import jwt_decode from 'jwt-decode';
import { UserContext } from '../App';

const useRoleAccess = (allowedRoles) => {
  const { userData } = useContext(UserContext);

  if (!userData || !userData.access) return false;

  const decodedToken = jwt_decode(userData.access);
  const userRole = decodedToken.user_type;

  return allowedRoles.includes(userRole);
};

export default useRoleAccess;
