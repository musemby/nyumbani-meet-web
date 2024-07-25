import { useApi } from "./useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DefaultApiListParams = {
  limit?: number;
  offset?: number;
};

interface RestaurantType {
  id: number;
  name: string;
  description?: string | null;
}

const useRestaurantApi = () => {
  return useApi("/restaurants/restaurants");
};

export const useRestaurant = (id?: string, enabled?: boolean) => {
  console.log(!!id, enabled);
  const { useFetch } = useRestaurantApi();
  return useFetch<RestaurantType>(
    ["Restaurant", id],
    `/${id}`,
    {},
    {},
    {},
    {
      enabled: !!id && enabled,
      refetchInterval: enabled ? 1000 * 2 : undefined,
    }
  );
};

export const useRestaurantList = (params: DefaultApiListParams = {}) => {
  const { useFetch } = useRestaurantApi();
  return useFetch<RestaurantType[]>(
    ["Restaurant", JSON.stringify(params)],
    "/",
    {},
    params,
    {},
    {
      refetchInterval: 1000 * 15,
    }
  );
};

export const useCreateRestaurant = () => {
  const { create } = useRestaurantApi();
  const queryClient = useQueryClient();
  return useMutation<RestaurantType, any, any>(
    ({ data }: { data: any }) => {
      console.log("data", data);
      return create<RestaurantType>("/create/", data);
    },
    {
      onSuccess: (data: any) => {
        console.log("data", data);
        queryClient.invalidateQueries(["Restaurant"]);
        queryClient.invalidateQueries(["userProfile"]);
      },
    }
  );
};
