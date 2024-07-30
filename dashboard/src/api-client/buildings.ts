import { useApi } from "./useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DefaultApiListParams = {
  limit?: number;
  offset?: number;
};

interface BuildingType {
  id: number;
  name: string;
  number: number;
  description?: string | null;
  organization: string;
  location: string;
}

const useBuildingApi = () => {
  return useApi("/bookings");
};

export const useBuilding = (id?: string, enabled?: boolean) => {
  console.log(!!id, enabled);
  const { useFetch } = useBuildingApi();
  return useFetch<BuildingType>(
    ["Building", id],
    `/buildings/${id}`,
    {},
    {},
    {},
    {
      enabled: !!id && enabled,
      refetchInterval: enabled ? 1000 * 2 : undefined,
    }
  );
};

export const useBuildingList = (params: DefaultApiListParams = {}) => {
  const { useFetch } = useBuildingApi();
  return useFetch<BuildingType[]>(
    ["Building", JSON.stringify(params)],
    "/buildings/",
    {},
    params,
    {},
    {
      refetchInterval: 1000 * 15,
    }
  );
};

export const useCreateBuilding = () => {
  const { create } = useBuildingApi();
  const queryClient = useQueryClient();
  return useMutation<BuildingType, any, any>(
    ({ data }: { data: any }) => {
      return create<BuildingType>("/buildings/create/", data);
    },
    {
      onSuccess: (data: any) => {
        console.log("data", data);
        queryClient.invalidateQueries(["Building"]);
        queryClient.invalidateQueries(["userProfile"]);
      },
    }
  );
};

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();
  const { remove } = useBuildingApi();

  return useMutation({
    mutationFn: ({ uuid }: { uuid: string }) => {
      return remove(`/buildings/${uuid}/delete/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Building"]);
    },
  });
};

export const useUpdateBuilding = () => {
  const { update } = useBuildingApi();
  const queryClient = useQueryClient();
  return useMutation<BuildingType, any, any>(
    ({ uuid, data }: { uuid: string; data: any }) => {
      return update(`/buildings/${uuid}/update/`, data);
    },
    {
      onSuccess: (data: any) => {
        console.log("data", data);
        queryClient.invalidateQueries(["Building"]);
        queryClient.invalidateQueries(["userProfile"]);
      },
    }
  );
};
