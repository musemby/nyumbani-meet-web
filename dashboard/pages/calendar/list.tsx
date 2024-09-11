import dayjs from "dayjs";
import {
  useBookingDashboard,
  useBookingList,
} from "../../src/api-client/bookings";
import { useRoomList } from "../../src/api-client/rooms";
import { useState } from "react";
import { Select, Table, Col, Row, DatePicker, Card, Grid, Button } from "antd";
import { useUserList } from "../../src/api-client/user";
import { Typography } from "antd";

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
  const { useBreakpoint } = Grid;

  const {} = useBookingDashboard();
  const screens = useBreakpoint();

  // Define columns for large and small screens
  const fullColumns = [
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
  ];

  // Define fewer columns for small screens
  const smallScreenColumns = [
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      render: (text) => dayjs(text).format("MMMM Do YYYY, h:mm a"),
      width: 200,
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      render: (text) => dayjs(text).format("MMMM Do YYYY, h:mm a"),
    },
    {
      title: "Tenant Name",
      dataIndex: "tenant_name",
      key: "tenant_name",
    },
    {
      title: "Room",
      dataIndex: "room_name",
      key: "room_name",
    },
  ];

  const bookingsUrlParams = {
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
  };

  const {
    data: bookings,
    isLoading: bookingsIsLoading,
    isError: bookingsIsError,
    refetch: refetchBookings,
  } = useBookingList(bookingsUrlParams);

  const {
    data: rooms,
    isLoading: roomsIsLoading,
    isError: roomsIsError,
    refetch: refetchRooms,
  } = useRoomList();

  function downloadCSV() {
    const csv = bookings.map((booking) => {
      return [
        booking.description,
        dayjs(booking.start_time).format("MMMM Do YYYY, h:mm a"),
        dayjs(booking.end_time).format("MMMM Do YYYY, h:mm a"),
        booking.room_name,
        booking.tenant_name,
        booking.tenant_phone_number,
        booking.tenant_house_number,
      ];
    });

    const header = [
      "Description",
      "Start Time",
      "End Time",
      "Room",
      "Tenant Name",
      "Tenant Phone",
      "House Number",
    ];

    const csvArray = [header, ...csv];

    const csvContent = csvArray
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${dayjs().format("YYYY-MM-DD_HH-mm-ss")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Typography.Title level={3} style={{ margin: "10px auto", textAlign: "center" }}>
        Bookings
      </Typography.Title>

      <Row gutter={[16, 16]} style={{ margin: "20px auto" }}>
        <Col xs={24} sm={12} lg={6}>
          <RangePicker
            style={{ width: "100%" }}
            value={selectedTimeRange}
            onChange={(value) => setSelectedTimeRange(value)}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Select
            style={{ width: "100%" }}
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
        <Col xs={24} sm={12} lg={6}>
          <Select
            style={{ width: "100%" }}
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
        <Col xs={24} sm={12} lg={6} style={{ textAlign: "center" }}>
          <Button type="primary" onClick={downloadCSV} style={{ width: "100%" }}>
            Download CSV
          </Button>
        </Col>
      </Row>

      <Card>
        <Table
          style={{ margin: "20px auto" }}
          dataSource={bookings || []}
          bordered
          title={() => "Bookings"}
          loading={bookingsIsLoading}
          // Conditionally render columns based on screen size
          columns={screens.lg ? fullColumns : smallScreenColumns}
        />
      </Card>
    </>
  );
};

export default Users;
