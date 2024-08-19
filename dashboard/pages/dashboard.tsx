import { useBookingDashboard } from "../src/api-client/bookings";
import dayjs from "dayjs";
import { Card, Col, Row, Statistic } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useBookingList } from "../src/api-client/bookings";
import { useRef, useState } from "react";
import { List, DatePicker } from "antd";
import { Typography } from "antd";

type Props = {};

const defaultEvent = {
  editable: false,
  overlap: false,
};

function bookingToEvent(booking) {
  return {
    ...defaultEvent,
    id: booking.id,
    title: booking.description,
    start: dayjs(booking.start_time).toDate(),
    end: dayjs(booking.end_time).toDate(),
    resourceId: booking.room,
  };
}

const Dashboard = (props: Props) => {
  const calendarRef = useRef(null);
  const initialCalendarView = "dayGridMonth";
  const {
    data: bookingAnalytics,
    isLoading: bookingAnalyticsIsLoading,
    // isError: bookingAnalyticsIsError,
    // refetch: refetchBookingAnalytics,
  } = useBookingDashboard();

  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([dayjs().startOf("month"), dayjs().endOf("month")]);

  const {
    data: bookings,
    isLoading: bookingsIsLoading,
    isError: bookingsIsError,
    refetch: refetchBookings,
  } = useBookingList({
    start_time__gte:
      selectedTimeRange && selectedTimeRange.length == 2
        ? selectedTimeRange[0]?.toDate()
        : null,
    end_time__lte:
      selectedTimeRange && selectedTimeRange.length == 2
        ? selectedTimeRange[1]?.toDate()
        : null,
  });

  const events =
    (bookings || []).map((booking) => bookingToEvent(booking)) || [];

  return (
    <>
      <Typography.Title level={3} style={{ margin: "10px auto" }}>
        Bookings
      </Typography.Title>
      <DatePicker.RangePicker
        style={{ margin: "20px auto" }}
        value={selectedTimeRange}
        onChange={(value) => setSelectedTimeRange(value)}
      />
      <Row gutter={16} style={{ margin: "20px auto" }}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Upcoming Bookings"
              value={bookingAnalytics?.upcoming_bookings_count || 0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Ongoing Bookings"
              value={bookingAnalytics?.ongoing_bookings_count || 0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Past Bookings"
              value={bookingAnalytics?.past_bookings_count || 0}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ margin: "20px auto" }}>
        <Col span={18}>
          <Card
            bordered={false}
            // style={{ height: "100%", width: "100%" }}
            style={{
              height: "100%",
            }}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin]}
              headerToolbar={null}
              initialView={initialCalendarView}
              nowIndicator={true}
              editable={true}
              selectable={false}
              selectMirror={false}
              events={events}
              //   dateClick={handleDateClick}
              height="50dvh"
              //   width="100%"
              selectAllow={() => false}
              eventDurationEditable={false}
              eventStartEditable={false}
              eventResizableFromStart={false}
              droppable={false}
              //   eventClick={handleEventClick}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <List header={<div>Upcoming bookings</div>} bordered size="small">
              {(bookingAnalytics?.upcoming_bookings || []).map((booking) => (
                <List.Item key={booking.id}>
                  {/* <Typography.Text> */}
                  {booking.description} | Room {booking.room_name} |{" "}
                  {dayjs(booking.start_time).format("MMMM Do, h:mm a")}
                  {/* </Typography.Text> */}
                </List.Item>
              ))}
            </List>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
