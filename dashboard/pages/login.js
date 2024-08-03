'use client'

import React from 'react'
import { Button, Form, Input } from 'antd'
import useAuth from '../src/hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { Link } from 'next/link'

const App = () => {
  const router = useRouter()
  const { authenticateWithServer, passwordResetRequired, authLoading, isAuthenticated, token } =
    useAuth()
  const snackbar = useSnackbar()

  const onFinish = (values) => {
    authenticateWithServer(values.username, values.password)
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo) => {
    snackbar.enqueueSnackbar('Error saving form', {
      variant: 'error',
    })
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    if (isAuthenticated) {
      console.log('isAuthenticated', isAuthenticated)
      if (passwordResetRequired) {
        router.push('/password-reset')
        snackbar.enqueueSnackbar(`Please cahnge your password first.`, {
          variant: "warning",
        });
      } else {
      router.push('/calendar')
      }
    }
  }, [isAuthenticated, passwordResetRequired,  router])

  return (
    <div
      style={{
        margin: '10 auto',
        padding: '10 auto',
        width: '100%',
      }}
    >
      <Form
        name='basic'
        //   labelCol={{
        //     span: 8,
        //   }}
        //   wrapperCol={{
        //     span: 16,
        //   }}
        style={{
          maxWidth: 600,
          margin: '0 auto',
        }}
        initialValues={{
          username: '',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label='Phone Number'
          name='username'
          rules={[
            {
              required: true,
              message: 'Please input your phone number!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        {/* forgot password */}
        {/* <Link href='/password-reset'>Forgot Password</Link> */}
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type='primary' htmlType='submit' disabled={authLoading}>
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default App
