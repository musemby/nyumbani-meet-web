import { UserProfileType } from "@/models/userProfile";
import { useApi } from "@/api-client/useApi";

const useUserProfileApi = () => {
  return useApi("/api/user_profiles");
};

export const useUserProfile = (
  username: string,
  hideErrors: boolean = true
) => {
  const { useFetch } = useUserProfileApi();
  return useFetch<UserProfileType>(
    ["userProfile", username],
    `/${username}`,
    {},
    {},
    {},
    {},
    hideErrors
  );
};
