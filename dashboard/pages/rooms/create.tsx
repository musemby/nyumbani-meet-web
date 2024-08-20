"use client";

import React from "react";
import { Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useCreateRoom } from "../../src/api-client/rooms";
import { useBuildingList } from "../../src/api-client/buildings";
import { TimePicker } from "antd";
import { Row, Col } from "antd";

const App = () => {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { mutateAsync: createRoom, isLoading: createRoomIsLoading } =
    useCreateRoom();

  const {
    data: buildings,
    isLoading: buildingsIsLoading,
    // isError: buildingsIsError,
    // refetch: refetchBuildings,
  } = useBuildingList();

  const onFinish = async (values) => {
    try {
      console.log("values", values);
      await createRoom({ data: values });
      snackbar.enqueueSnackbar("Room created successfully", {
        variant: "success",
      });

      router.push("/rooms");
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar(`Error creating room ${error}`, {
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
      height: '65vh',
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
        <h1 style={{ marginTop: '15px' }}>Create Room</h1>
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
          label="Building"
          name="building"
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          <Select
            options={
              buildings?.map((building) => ({
                value: building.id,
                label: building.name,
              })) || []
            }
          />
        </Form.Item>

        <Form.Item
          label="Room Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the room name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Room Description" name="description" rules={[]}>
          <Input />
        </Form.Item>

        <Form.Item label="Operates from" name="operates_from" rules={[]}>
          <TimePicker />
        </Form.Item>
      
        <Form.Item label="Operates to" name="operates_to" rules={[]}>
          <TimePicker />
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
            disabled={createRoomIsLoading}
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
