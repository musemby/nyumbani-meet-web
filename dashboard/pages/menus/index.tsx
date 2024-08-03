import React from "react";
import { Table, Button, Tag } from "antd";
import { useMenuList, useActivateMenu } from "../../src/api-client/menus";
import { SERVER_URL } from "../../src/constants";
import { LinkOutlined } from "@ant-design/icons";
import { useSnackbar } from "notistack";
import { useUser } from "../../src/api-client/user";

const Menus = () => {
  const snackbar = useSnackbar();
  const {
    data: menus,
    isLoading: menusIsLoading,
    // isError: menusIsError,
    refetch: refetchMenus,
  } = useMenuList();

  const { data: user } = useUser("me");

  const { mutateAsync: activateMenu } = useActivateMenu();

  async function handleActivateMenu(menuId: string) {
    try {
      activateMenu({ uuid: menuId });
      snackbar.enqueueSnackbar("Menu activated", { variant: "success" });
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar(`Error activating menu ${error}`, {
        variant: "error",
      });
    }
    refetchMenus();
  }

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
          ...(user && user.is_admin
            ? [
                {
                  title: "Activate",
                  dataIndex: "id",
                  key: "id",
                  render: (id: string, row) => {
                    return (
                      <>
                        {row.is_active_menu ? (
                          <Tag color={"green"}>Active</Tag>
                        ) : (
                          <Button
                            type="primary"
                            onClick={() => handleActivateMenu(id)}
                            disabled={menusIsLoading}
                          >
                            Activate
                          </Button>
                        )}
                      </>
                    );
                  },
                },
              ]
            : []),
        ]}
      />
    </>
  );
};

export default Menus;
