import { useApi } from './useApi'

type DefaultApiListParams = {
  limit?: number
  offset?: number
}

interface UserType {
  id: number
  phone_number: string
  is_admin: boolean
  is_staff: boolean
}

const useUserApi = () => {
  return useApi('/auth/users')
}

export const useUser = (id?: string, enabled?: boolean) => {
  console.log(!!id, enabled)
  const { useFetch } = useUserApi()
  return useFetch<UserType>(
    ['User', id],
    `/${id}/`,
    {},
    {},
    {},
    {
      enabled: !!id && enabled,
      refetchInterval: enabled ? 1000 * 2 : undefined,
    }
  )
}

export const useUserList = (params: DefaultApiListParams = {}) => {
  const { useFetch } = useUserApi()
  return useFetch<UserType[]>(
    ['User', JSON.stringify(params)],
    '/',
    {},
    params,
    {},
    {
      refetchInterval: 1000 * 15,
    }
  )
}
