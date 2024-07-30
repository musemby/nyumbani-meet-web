"use client";

import React from "react";
import { Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useCreateRoom } from "../../src/api-client/rooms";
import { useBuildingList } from "../../src/api-client/buildings";

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

        <Form.Item>
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
  );
};
export default App;
