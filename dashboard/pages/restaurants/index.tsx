import React from "react";
import { Table } from "antd";
import { useRestaurantList } from "../../src/api-client/restaurants";

const Restaurants = () => {
  const {
    data: restaurants,
    isLoading: restaurantsIsLoading,
    // isError: restaurantsIsError,
    // refetch: refetchRestaurants,
  } = useRestaurantList();

  return (
    <>
      <Table
        style={{
          margin: "20px auto",
        }}
        dataSource={restaurants || []}
        bordered
        title={() => "Restaurants"}
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
