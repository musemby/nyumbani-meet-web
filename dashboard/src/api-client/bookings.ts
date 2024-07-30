import { useApi } from "./useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DefaultApiListParams = {
  booked_by__in?: string | null;
  room__in?: string | null;
  start_time__gte?: Date | null;
  end_time__lte?: Date | null;
};

interface BookingType {
  id: number;
  start_time: string;
  end_time: string;
  description?: string | null;
  organization: string;
  room: string;
  room_name: string;
  tenant_phone_number: string;
  tenant_name: string;
  tenant_house_number: string;
}

const useBookingApi = () => {
  return useApi("/bookings");
};

export const useBooking = (id?: string, enabled?: boolean) => {
  console.log(!!id, enabled);
  const { useFetch } = useBookingApi();
  return useFetch<BookingType>(
    ["Booking", id],
    `/bookings${id}`,
    {},
    {},
    {},
    {
      enabled: !!id && enabled,
      refetchInterval: enabled ? 1000 * 2 : undefined,
    }
  );
};

export const useBookingList = (params: DefaultApiListParams = {}) => {
  const { useFetch } = useBookingApi();
  return useFetch<BookingType[]>(
    ["Booking", JSON.stringify(params)],
    "/bookings/",
    {},
    params,
    {},
    {
      refetchInterval: 1000 * 15,
    }
  );
};

export const useCreateBooking = () => {
  const { create } = useBookingApi();
  const queryClient = useQueryClient();
  return useMutation<BookingType, any, any>(
    ({ data }: { data: any }) => {
      return create<BookingType>("/bookings/create/", data);
    },
    {
      onSuccess: (data: any) => {
        console.log("data", data);
        queryClient.invalidateQueries(["Booking"]);
        queryClient.invalidateQueries(["userProfile"]);
      },
    }
  );
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  const { remove } = useBookingApi();

  return useMutation({
    mutationFn: ({ uuid }: { uuid: string }) => {
      return remove(`/bookings/${uuid}/delete/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Booking"]);
    },
  });
};

export const useUpdateBooking = () => {
  const { update } = useBookingApi();
  const queryClient = useQueryClient();
  return useMutation<BookingType, any, any>(
    ({ uuid, data }: { uuid: string; data: any }) => {
      return update(`/bookings/${uuid}/update/`, data);
    },
    {
      onSuccess: (data: any) => {
        console.log("data", data);
        queryClient.invalidateQueries(["Booking"]);
        queryClient.invalidateQueries(["userProfile"]);
      },
    }
  );
};
