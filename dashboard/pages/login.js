'use client'

import React from 'react'
import { Button, Form, Input, Checkbox } from 'antd'
import useAuth from '../src/hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSnackbar } from 'notistack'
import Image from 'next/image'

const App = () => {
  const router = useRouter()
  const { authenticateWithServer, passwordResetRequired, authLoading, isAuthenticated } = useAuth()
  const snackbar = useSnackbar()

  const onFinish = (values) => {
    authenticateWithServer(values.email, values.password)
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
      if (passwordResetRequired) {
        router.push('/password-reset')
        snackbar.enqueueSnackbar(`Please change your password first.`, {
          variant: "warning",
        });
      } else {
        router.push('/calendar')
      }
    }
  }, [isAuthenticated, passwordResetRequired, router, snackbar])

  return (
    <div style={{
      height: '100vh',
      backgroundImage: 'url(/images/city-brown.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        marginBottom: '20px',
        marginLeft: '10px',
        marginRight: '10px',
      }}>
        <Image src="/images/Dark2-bg_Logo1.png" alt="logo" width={380} height={95} />
      </div>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '30px',
        paddingTop: '20px',
        paddingBottom: '20px',
        borderRadius: '8px',
        margin: '5px',
        width: '350px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ marginTop: '10px' }}>Log in</h1>
        </div>
        <Form
          name='login'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name='email'
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>
    
          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
    
          <Form.Item>
            <Button type='primary' htmlType='submit' disabled={authLoading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    
  )
}

export default App