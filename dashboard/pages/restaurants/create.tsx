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
    <div
      style={{
        margin: "10px auto",
        padding: "10px auto",
        width: "100%",
      }}
    >
      <Form
        name="basic"
        //   labelCol={{
        //     span: 8,
        //   }}
        //   wrapperCol={{
        //     span: 16,
        //   }}
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

        <Form.Item>
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
  );
};
export default App;
