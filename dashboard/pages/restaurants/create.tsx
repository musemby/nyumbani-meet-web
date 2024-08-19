"use client";

import React from "react";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useCreateRestaurant } from "../../src/api-client/restaurants";

const App = () => {
  const router = useRouter();
  const snackbar = useSnackbar();
  const {
    mutateAsync: createRestaurant,
    isLoading: createRestaurantIsLoading,
  } = useCreateRestaurant();

  const onFinish = async (values) => {
    try {
      console.log("values", values);
      await createRestaurant({ data: values });
      snackbar.enqueueSnackbar("Restaurant created successfully", {
        variant: "success",
      });

      router.push("/restaurants");
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar(`Error creating restaurant ${error}`, {
        variant: "error",
      });
    }

    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    snackbar.enqueueSnackbar("Error saving form", {
      variant: "error",
    });
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{
      height: '40vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'top',

    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '30px',
        paddingTop: '0',
        borderRadius: '8px',
        width: '655px',
      }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ marginTop: '15px' }}>Create Restaurant</h1>
      </div>
      <Form
        name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        style={{
          maxWidth: 600,
          margin: "0 auto",
        }}
        initialValues={{
          username: "+254703130581",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Restaurant Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the restaurant name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Restaurant Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input the restaurant description",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            disabled={createRestaurantIsLoading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
    </div>
  );
};
export default App;
