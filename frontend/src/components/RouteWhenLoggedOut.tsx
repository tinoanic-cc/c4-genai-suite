import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { AuthApi, ResponseError, useApi } from 'src/api';

const useIsLoggedOut = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['is-logged-out'],
    queryFn: async () => {
      try {
        await new AuthApi(api.configuration).getProfile();
        return false;
      } catch (error) {
        if (error instanceof ResponseError && error.response?.status === 401) {
          return true;
        }
        throw error;
      }
    },
  });
};
export function RouteWhenLoggedOut({ children }: React.PropsWithChildren) {
  const { isPending, data: isLoggedOut } = useIsLoggedOut();

  if (isPending) return <></>;

  if (isLoggedOut) {
    return <>{children}</>;
  }
  return <Navigate to="/chat" />;
}
