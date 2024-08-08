"use client";

import React from "react";
import { Button, Form, Input, InputNumber } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useCreateBuilding } from "../../src/api-client/buildings";

const App = () => {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { mutateAsync: createBuilding, isLoading: createBuildingIsLoading } =
  useCreateBuilding();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      console.log("values", values);
      await createBuilding({ data: values });
      snackbar.enqueueSnackbar("Building created successfully", {
        variant: "success",
      });

      router.push("/buildings");
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar(`Error creating building ${error}`, {
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
      height: '30vh',
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
        <h1 style={{ marginTop: '15px' }}>Create Building</h1>
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
          username: "",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the building name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[]}>
          <Input />
        </Form.Item>

        <Form.Item label="Number" name="number" rules={[]}>
          <InputNumber />
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
            disabled={createBuildingIsLoading}
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
