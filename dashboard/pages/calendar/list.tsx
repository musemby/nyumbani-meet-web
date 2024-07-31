import dayjs from "dayjs";
import {
  useBookingDashboard,
  useBookingList,
} from "../../src/api-client/bookings";
import { useRoomList } from "../../src/api-client/rooms";
import { useState } from "react";
import { Select, Table, Col, Row, DatePicker, Card } from "antd";
import { useUserList } from "../../src/api-client/user";

const { RangePicker } = DatePicker;

const Users = () => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>(null);
  const [selectedTenant, setSelectedTenant] = useState<string>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([dayjs().subtract(1, "day"), dayjs().add(30, "day")]);
  const {
    data: users,
    isLoading: usersIsLoading,
    // isError: usersIsError,
    // refetch: refetchUsers,
  } = useUserList();

  const {} = useBookingDashboard();

  const {
    data: bookings,
    isLoading: bookingsIsLoading,
    isError: bookingsIsError,
    refetch: refetchBookings,
  } = useBookingList({
    room__in:
      selectedRooms && selectedRooms.length > 0 ? String(selectedRooms) : null,
    booked_by__in:
      selectedTenant && selectedTenant.length > 0
        ? String(selectedTenant)
        : null,
    start_time__gte:
      selectedTimeRange && selectedTimeRange.length == 2
        ? selectedTimeRange[0]?.toDate()
        : null,
    end_time__lte:
      selectedTimeRange && selectedTimeRange.length == 2
        ? selectedTimeRange[1]?.toDate()
        : null,
  });

  const {
    data: rooms,
    isLoading: roomsIsLoading,
    isError: roomsIsError,
    refetch: refetchRooms,
  } = useRoomList();

  return (
    <>
      <>
        <Row>
          <Col sm={12} lg={6}>
            <RangePicker
              value={selectedTimeRange}
              onChange={(value) => setSelectedTimeRange(value)}
            />
          </Col>
          <Col sm={12} lg={6}>
            <Select
              style={{ minWidth: 200, width: "100%" }}
              mode="multiple"
              placeholder="Room"
              value={selectedRooms}
              onChange={(value) => setSelectedRooms(value)}
              loading={roomsIsLoading}
              options={rooms?.map((room) => ({
                value: room.id,
                label: room.name,
              }))}
            />
          </Col>
          <Col sm={12} lg={6}>
            <Select
              style={{ minWidth: 200, width: "100%" }}
              mode="multiple"
              placeholder="Tenant"
              value={selectedTenant}
              onChange={(value) => setSelectedTenant(value)}
              loading={roomsIsLoading}
              options={users?.map((user) => ({
                value: user.id,
                label: `${user.name} - ${user.phone_number}`,
              }))}
            />
          </Col>
          <Col sm={12} lg={6}></Col>
        </Row>
      </>
      <Card>
        <Table
          style={{
            margin: "20px auto",
          }}
          dataSource={bookings ? bookings : []}
          bordered
          title={() => "Bookings"}
          loading={bookingsIsLoading}
          columns={[
            {
              title: "Description",
              dataIndex: "description",
              key: "description",
            },
            {
              title: "Start Time",
              dataIndex: "start_time",
              key: "start_time",
              render: (text) => dayjs(text).format("MMMM Do YYYY, h:mm a"),
              fixed: true,
              width: 200,
            },
            {
              title: "End Time",
              dataIndex: "end_time",
              key: "end_time",
              render: (text) => dayjs(text).format("MMMM Do YYYY, h:mm a"),
            },
            {
              title: "Room",
              dataIndex: "room_name",
              key: "room_name",
            },
            {
              title: "Tenant Name",
              dataIndex: "tenant_name",
              key: "tenant_name",
            },
            {
              title: "Tenant Phone",
              dataIndex: "tenant_phone_number",
              key: "tenant_phone_number",
            },
            {
              title: "Tenant House Number",
              dataIndex: "tenant_house_number",
              key: "tenant_house_number",
            },
          ]}
        />
      </Card>
    </>
  );
};

export default Users;
