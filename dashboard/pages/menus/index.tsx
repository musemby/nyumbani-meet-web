import React from "react";
import { Table } from "antd";
import { useMenuList } from "../../src/api-client/menus";
import { SERVER_URL } from "../../src/constants";
import { LinkOutlined } from "@ant-design/icons";

const Menus = () => {
  const {
    data: menus,
    isLoading: menusIsLoading,
    // isError: menusIsError,
    // refetch: refetchMenus,
  } = useMenuList();

  return (
    <>
      <Table
        style={{
          margin: "20px auto",
        }}
        dataSource={menus || []}
        bordered
        title={() => "Menus"}
        loading={menusIsLoading}
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
            title: "Open",
            dataIndex: "file",
            key: "file",
            render: (file: string) => {
              return (
                <a
                  href={file.startsWith("/") ? `${SERVER_URL}${file}` : file}
                  target="_blank"
                >
                  <LinkOutlined />
                </a>
              );
            },
          },
        ]}
      />
    </>
  );
};

export default Menus;
