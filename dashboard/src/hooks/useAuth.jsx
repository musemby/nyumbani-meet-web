import { useState } from 'react'
import { SERVER_URL } from '../constants'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

function useAuth() {
  const snackbar = useSnackbar()
  const [token, setToken] = useState()
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    getToken()
  }, [])

  async function authenticateWithServer(phone, password) {
    setAuthLoading(true)
    deleteToken()
    try {
      const response = await fetch(`${SERVER_URL}/auth/nyumani_core/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phone,
          password,
        }),
      })
      const data = await response.json()
      console.log('data', data)
      console.log('data.token', data.token)
      console.log(data)
      if (data.token) {
        saveToken(data.token)
      }
    } catch (error) {
      console.log(error)
      snackbar.enqueueSnackbar(`Error saving form ${error}`, {
        variant: 'error',
      })
    }
    setAuthLoading(false)
    return null
  }

  function saveToken(token) {
    setToken(null)
    localStorage.setItem('token', token)
  }

  function deleteToken() {
    setToken(null)
    localStorage.removeItem('token')
  }

  function getToken() {
    if (!token) {
      const foundToken = localStorage.getItem('token')
      if (foundToken) {
        setToken(foundToken)
        return foundToken
      } else {
        return null
      }
    }
    return token
  }

  return {
    isAuthenticated: !!token,
    authLoading,
    token,
    saveToken,
    deleteToken,
    authenticateWithServer,
    getToken,
  }
}
export default useAuth
