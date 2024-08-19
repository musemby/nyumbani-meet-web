import React from "react";
import { Table } from "antd";
import { useRestaurantList } from "../../src/api-client/restaurants";
import { Typography } from "antd";

const Restaurants = () => {
  const {
    data: restaurants,
    isLoading: restaurantsIsLoading,
    // isError: restaurantsIsError,
    // refetch: refetchRestaurants,
  } = useRestaurantList();

  return (
    <>
      <Typography.Title level={3} style={{ margin: "10px auto" }}>
        Restaurants
      </Typography.Title>
      <Table
        style={{
          margin: "20px auto",
        }}
        dataSource={restaurants || []}
        bordered
        loading={restaurantsIsLoading}
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
        ]}
      />
    </>
  );
};

export default Restaurants;
