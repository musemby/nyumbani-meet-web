import React from "react";
import { Table } from "antd";
import { useBuildingList } from "../../src/api-client/buildings";

const Buildings = () => {
  const {
    data: buildings,
    isLoading: buildingsIsLoading,
    // isError: buildingsIsError,
    // refetch: refetchBuildings,
  } = useBuildingList();

  return (
    <>
      <Table
        style={{
          margin: "20px auto",
        }}
        dataSource={buildings || []}
        bordered
        title={() => "Buildings"}
        loading={buildingsIsLoading}
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
            title: "Number",
            dataIndex: "number",
            key: "number",
          },
        ]}
      />
    </>
  );
};

export default Buildings;
