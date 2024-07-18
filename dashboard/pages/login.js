'use client'

import React from 'react'
import { Button, Form, Input } from 'antd'
import useAuth from '../src/hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSnackbar } from 'notistack'

const App = () => {
  const router = useRouter()
  const { authenticateWithServer, authLoading, isAuthenticated } = useAuth()
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
      router.push('/calendar')
    }
  }, [isAuthenticated, router])

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
          username: '+254703130581',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label='Username'
          name='username'
          rules={[
            {
              required: true,
              message: 'Please input your username!',
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

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type='primary' htmlType='submit' disabled={authLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default App
