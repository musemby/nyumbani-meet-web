"use client";

import React from "react";
import { Button, Form, Input, Upload, Select } from "antd";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useCreateMenu } from "../../src/api-client/menus";
import { UploadOutlined } from "@ant-design/icons";
import { useRestaurantList } from "../../src/api-client/restaurants";

const App = () => {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { mutateAsync: createMenu, isLoading: createMenuIsLoading } =
    useCreateMenu();

  const {
    data: restaurants,
    isLoading: restaurantsIsLoading,
    // isError: restaurantsIsError,
    // refetch: refetchRestaurants,
  } = useRestaurantList();

  const onFinish = async (values) => {
    console.log("values", values);
    try {
      console.log("values", values);
      console.log("values.file", values.file);
      console.log("values.file.file", values.file.file);
      console.log(
        "values.file.file.originFileObj",
        values.file.file.originFileObj
      );

      const formData = new FormData();
      formData.append("file", values.file.file.originFileObj);
      for (const key in values) {
        if (key !== "file") {
          formData.append(key, values[key]);
        }
      }

      await createMenu({ data: formData });
      snackbar.enqueueSnackbar("Menu created successfully", {
        variant: "success",
      });

      router.push("/menus");
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar(`Error creating menu ${error}`, {
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
          label="Menu Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the menu name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Menu Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input the menu description",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Menu File"
          name="file"
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          <Upload name="file">
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Restaurant"
          name="restaurant"
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          <Select
            options={
              restaurants?.map((restaurant) => ({
                value: restaurant.id,
                label: restaurant.name,
              })) || []
            }
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={createMenuIsLoading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default App;
