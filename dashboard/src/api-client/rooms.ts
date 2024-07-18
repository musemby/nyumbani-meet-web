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
}

interface RoomResponseType {
  results: RoomType[]
  limit: number
  offset: number
  count: number
  next: null
  previous: null
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
  return useFetch<RoomResponseType>(
    ['Room', JSON.stringify(params)],
    '/list',
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
      return create<RoomType>('/create', data)
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
