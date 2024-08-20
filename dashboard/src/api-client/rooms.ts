import { useApi } from './useApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type DefaultApiListParams = {
  limit?: number
  offset?: number
}

interface RoomType {
  id: number
  name: string
  building: string
  capacity?: number | null
  description?: string | null
  operates_from: string | null  
  operates_to: string | null
}

const useRoomApi = () => {
  return useApi('/bookings/rooms')
}

export const useRoom = (id?: string, enabled?: boolean) => {
  console.log(!!id, enabled)
  const { useFetch } = useRoomApi()
  return useFetch<RoomType>(
    ['Room', id],
    `/${id}`,
    {},
    {},
    {},
    {
      enabled: !!id && enabled,
      refetchInterval: enabled ? 1000 * 2 : undefined,
    }
  )
}

export const useRoomList = (params: DefaultApiListParams = {}) => {
  const { useFetch } = useRoomApi()
  return useFetch<RoomType[]>(
    ['Room', JSON.stringify(params)],
    '/',
    {},
    params,
    {},
    {
      refetchInterval: 1000 * 15,
    }
  )
}

export const useCreateRoom = () => {
  const { create } = useRoomApi()
  const queryClient = useQueryClient()
  return useMutation<RoomType, any, any>(
    ({ data }: { data: any }) => {
      console.log('data', data)
      // convert operates_from and operates_to to time
      data.operates_from = data.operates_from.format('HH:mm')
      data.operates_to = data.operates_to.format('HH:mm')
      return create<RoomType>('/create/', data)
    },
    {
      onSuccess: (data: any) => {
        console.log('data', data)
        queryClient.invalidateQueries(['Room'])
        queryClient.invalidateQueries(['userProfile'])
      },
    }
  )
}
