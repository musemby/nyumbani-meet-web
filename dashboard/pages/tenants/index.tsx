import React from "react";
import { Table, Tag } from "antd";
import { useUserList } from "../../src/api-client/user";
import { Typography } from "antd";

const Users = () => {
  const {
    data: users,
    isLoading: usersIsLoading,
    // isError: usersIsError,
    // refetch: refetchUsers,
  } = useUserList();

  return (
    <>
      <Typography.Title level={3} style={{ margin: "10px auto" }}>
        Tenants
      </Typography.Title>
      <Table  
        style={{
          margin: "20px auto",
        }}
        dataSource={users || []}
        bordered
        loading={usersIsLoading}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "House Number",
            dataIndex: "house_number",
            key: "house_number",
          },
          {
            title: "Phone",
            dataIndex: "phone_number",
            key: "phone_number",
          },
          {
            title: "Admin",
            dataIndex: "is_admin",
            render: (text) =>
              text ? (
                <Tag color={"green"}>Yes</Tag>
              ) : (
                <Tag color={"red"}>No</Tag>
              ),
          },
        ]}
      />
    </>
  );
};

export default Users;
