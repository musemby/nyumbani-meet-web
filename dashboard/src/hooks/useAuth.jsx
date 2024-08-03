import { useState } from "react";
import { SERVER_URL } from "../constants";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useRouter } from "next/router";

function useAuth() {
  const snackbar = useSnackbar();
  const [token, setToken] = useState();
  const [authLoading, setAuthLoading] = useState(false);
  const [passwordResetRequired, setPasswordResetRequired] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login')
  //   }
  // }, [isAuthenticated, router])

  useEffect(() => {
    getToken();
  }, []);

  async function authenticateWithServer(phone, password) {
    setAuthLoading(true);
    deleteToken();
    try {
      const response = await fetch(`${SERVER_URL}/auth/nyumani_core/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phone,
          password,
        }),
      });

      const data = await response.json();
      if (data.token) {
        console.log("Save token");
        saveToken(data.token);
        if (data.reset_password) {
          setPasswordResetRequired(true);
        }
      } else {
        console.log("Token not found");
        deleteToken();
      }
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar(`Error saving form ${error}`, {
        variant: "error",
      });
      deleteToken();
    }
    setAuthLoading(false);
    return null;
  }

  async function resetPasswordWithServer(
    phone,
    currentPassword,
    newPassword,
    newPasswordConfirmation
  ) {
    setAuthLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/auth/nyumani_core/password_reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation,
        }),
      });

      const data = await response.json();
      console.log(data);
      deleteToken()
      router.push("/login");
      snackbar.enqueueSnackbar(`Password changed successfully`, {
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar(`Error saving form ${error}`, {
        variant: "error",
      });
      deleteToken();
    }
    setAuthLoading(false);
    return null;
  }

  async function logoutWithServer() {
    setAuthLoading(true);

    try {
      await fetch(`${SERVER_URL}/auth/nyumani_core/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar(`Error logging out ${error}`, {
        variant: "error",
      });
    }
    deleteToken();
    setAuthLoading(false);
    router.push("/login");
    return null;
  }

  function saveToken(token) {
    setToken(token);
    localStorage.setItem("token", token);
  }

  function deleteToken() {
    setToken(null);
    localStorage.removeItem("token");
  }

  function getToken() {
    if (!token) {
      const foundToken = localStorage.getItem("token");
      if (foundToken) {
        setToken(foundToken);
        return foundToken;
      } else {
        return null;
      }
    }
    return token;
  }

  return {
    isAuthenticated: !!token,
    passwordResetRequired,
    authLoading,
    token,
    saveToken,
    deleteToken,
    authenticateWithServer,
    resetPasswordWithServer,
    getToken,
    logout: logoutWithServer,
  };
}

export default useAuth
