import { useApi } from "./useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DefaultApiListParams = {
  limit?: number;
  offset?: number;
};

interface MenuType {
  id: number;
  name: string;
  description?: string | null;
  restaurant: string;
  file: string;
}

const useMenuApi = () => {
  return useApi("/restaurants/menus");
};

export const useMenu = (id?: string, enabled?: boolean) => {
  console.log(!!id, enabled);
  const { useFetch } = useMenuApi();
  return useFetch<MenuType>(
    ["Menu", id],
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

export const useMenuList = (params: DefaultApiListParams = {}) => {
  const { useFetch } = useMenuApi();
  return useFetch<MenuType[]>(
    ["Menu", JSON.stringify(params)],
    "/",
    {},
    params,
    {},
    {
      refetchInterval: 1000 * 15,
    }
  );
};

export const useCreateMenu = () => {
  const { create } = useMenuApi();
  const queryClient = useQueryClient();
  return useMutation<MenuType, any, any>(
    ({ data }: { data: any }) => {
      console.log("data", data);
      return create<MenuType>("/create/", data);
    },
    {
      onSuccess: (data: any) => {
        console.log("data", data);
        queryClient.invalidateQueries(["Menu"]);
        queryClient.invalidateQueries(["userProfile"]);
      },
    }
  );
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  const { remove } = useMenuApi();

  return useMutation({
    mutationFn: ({ uuid }: { uuid: string }) => {
      return remove(`/menus/${uuid}/delete/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Menu"]);
    },
  });
};
