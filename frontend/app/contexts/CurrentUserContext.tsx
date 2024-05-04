import React, { createContext, useContext, useEffect, useState } from 'react';
import { GetLoginUserResponse } from '../../../shared/models/responses/getLoginUserResponse';
import { getApiData } from '../actions/common';

interface CurrentUser {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string;
}

interface CurrentUserContextType {
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await getApiData<GetLoginUserResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_A}/users/login/user`
      );
      if (!(response instanceof Error) && response) {
        setCurrentUser(response);
      }
    };
    if (!currentUser) {
      fetchCurrentUser();
    }
  }, []);

  return <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUserContext = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error('useCurrentUserContext must be used within a CurrentUserProvider');
  }
  return context;
};
