import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback } from 'react'
import { SERVER_URL } from '../constants'
import useAuth from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'

type QueryKey = Array<unknown>

export function useApi(apiPath: string) {
  const { enqueueSnackbar } = useSnackbar()
  const { getToken, deleteToken } = useAuth()

  const router = useRouter()

  const buildUrl = (path: string) => `${SERVER_URL}${apiPath}${path}`

  axios.interceptors.response.use(
    // @ts-ignore
    (response) => response,
    // @ts-ignore
    (error) => {
      //
      return Promise.reject(error)
    }
  )

  const sendRequest = useCallback(
    async <T>(
      method: string,
      url: string,
      data?: any,
      params?: any,
      headers?: any,
      hideErrors?: boolean
    ): Promise<T> => {
      const apiHeaders = {
        ...headers,
      }

      const token = getToken()

      try {
        // const token = await refreshTokenIfExpired()
        if (token) {
          apiHeaders.authorization = `Token ${token}`
        }
      } catch (error) {
        console.log(error)
        enqueueSnackbar('Unauthorized. Redirecting...', { variant: 'error' })
        console.log('Unauthorized. Redirecting...')
        router.push('/auth/login')
      }

      const response = await axios({
        method,
        url: buildUrl(url),
        data,
        headers: apiHeaders,
        params: params,
      }).catch((error) => {
        console.log(error)
        // Sentry.captureException(error)
        console.log('hideErrors', hideErrors)
        console.log(error.response)
        if (error.response?.status === 401) {
          deleteToken()
          !hideErrors &&
            enqueueSnackbar('Unauthorized. Redirecting...', {
              variant: 'error',
            })
          console.log('Unauthorized. Redirecting...')
          router.push('/login')
        } else if (error.response?.status === 403) {
          !hideErrors && enqueueSnackbar('Forbidden', { variant: 'error' })
          console.log('Forbidden')
        } else if (error.response?.status === 404) {
          !hideErrors && enqueueSnackbar('Not found', { variant: 'error' })
          console.log('Not found')
        } else if (error.response?.data?.errors) {
          error.response.data.errors.forEach((error: any) => {
            let attr = error.attr
            if (attr) {
              // prettify attribute name
              attr = attr.replace(/_/g, ' ')
              attr = attr.charAt(0).toUpperCase() + attr.slice(1)
              attr = attr.trim()

              // remove non-useful attributes
              if (attr === 'Non field errors') {
                attr = ''
              } else if (attr === 'all') {
                attr = ''
              }

              // add colon
              if (attr) {
                attr = `${attr}: `
              }
            }
            !hideErrors &&
              enqueueSnackbar(`${attr}${error.detail}`, {
                variant: 'error',
                // preventDuplicate: true,
              })
          })
          console.log(error.response.data.errors)
        } else {
          !hideErrors && enqueueSnackbar(error.message, { variant: 'error' })
          console.log(error.message)
          // displayDrfErrors(error.response.data)
        }
        // reaise error
        throw error
      })

      return response.data
    },
    []
  )

  const useFetch = <T>(
    queryKey: QueryKey,
    url: string,
    data?: unknown,
    params?: any,
    headers?: any,
    options?: UseQueryOptions<T, Error, T, QueryKey>,
    hideErrors?: boolean
  ) => {
    return useQuery(
      queryKey,
      () => get<T>(url, data, params, headers, hideErrors),
      options
    )
  }

  const get = async <T>(
    url: string,
    data?: unknown,
    params?: any,
    headers?: any,
    hideErrors?: boolean
  ): Promise<T> => {
    // console.log('get', url);
    return sendRequest('GET', url, data, params, headers, hideErrors)
  }

  const create = async <T>(
    url: string,
    data?: unknown,
    headers?: any
  ): Promise<T> => {
    return sendRequest('POST', url, data, headers)
  }

  const update = async <T>(
    url: string,
    data?: unknown,
    headers?: any
  ): Promise<T> => {
    return sendRequest('PUT', url, data, headers)
  }

  const remove = async <T>(
    url: string,
    data?: unknown,
    headers?: any
  ): Promise<T> => {
    return sendRequest('DELETE', url, data, headers)
  }

  return {
    get,
    create,
    update,
    remove,
    useFetch,
  }
}
