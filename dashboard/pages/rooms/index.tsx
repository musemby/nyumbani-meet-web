import React from "react";
import { Table } from "antd";
import { useRoomList } from "../../src/api-client/rooms";
import { Typography } from "antd";

const Rooms = () => {
  const {
    data: rooms,
    isLoading: roomsIsLoading,
    // isError: roomsIsError,
    // refetch: refetchRooms,
  } = useRoomList();

  return (
    <>
      <Typography.Title level={3} style={{ margin: "10px auto" }}>
        Rooms
      </Typography.Title>
      <Table
        style={{
          margin: "20px auto",
        }}
        dataSource={rooms || []}
        bordered
        // title={() => "Rooms"}
        loading={roomsIsLoading}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Building",
            dataIndex: "building_name",
            key: "building",
          },
        ]}
      />
    </>
  );
};

export default Rooms;
