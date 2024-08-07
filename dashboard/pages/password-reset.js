'use client'

import React from 'react'
import { Button, Form, Input } from 'antd'
import useAuth from '../src/hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSnackbar } from 'notistack'
import Image from 'next/image'

const App = () => {
  const router = useRouter()
  const { resetPasswordWithServer, authLoading, isAuthenticated, token } =
    useAuth()
  const snackbar = useSnackbar()

  const onFinish = (values) => {
    resetPasswordWithServer(
      values.username,
      values.currentPassword,
      values.newPassword,
      values.newPasswordConfirmation,
    )
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo) => {
    snackbar.enqueueSnackbar('Error saving form', {
      variant: 'error',
    })
    console.log('Failed:', errorInfo)
  }

  return (
    <div style={{
      height: '100vh',
      backgroundImage: 'url(/path-to-your-city-image.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '30px',
        paddingTop: '0',
        borderRadius: '8px',
        width: '655px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Image src="/images/Dark2-bg_Logo.png" alt="Nyumbani Logo" width={100} height={100} />
          <h1 style={{ marginTop: '10px' }}>NYUMBANI MEET</h1>
        </div>
        <Form
        name='basic'
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        style={{
          maxWidth: 600,
          margin: '0 auto',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >

        <Form.Item
          label='Current Password'
          name='currentPassword'
          rules={[
            {
              required: true,
              message: 'Please input your current password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label='New Password'
          name='newPassword'
          rules={[
            {
              required: true,
              message: 'Please input your new password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label='New Password Confirmation'
          name='newPasswordConfirmation'
          rules={[
            {
              required: true,
              message: 'Please input your new password confirmation!',
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
    </div>
  )
}
export default App
