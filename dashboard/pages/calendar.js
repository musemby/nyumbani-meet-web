import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from "dayjs";
import {
  useBookingList,
  useCreateBooking,
  useUpdateBooking,
  useDeleteBooking,
} from "../src/api-client/bookings";
import { useUser } from "../src/api-client/user";
import { useRoomList } from "../src/api-client/rooms";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  Flex,
  Divider,
  Modal,
  TimePicker,
  Input,
  Button,
  Typography,
  Table,
} from "antd";
import { useSnackbar } from "notistack";
import { useUserList } from "../src/api-client/user";

const { Text, Link } = Typography;

var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

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

export default function CalendarPage() {
  const { enqueueSnackbar } = useSnackbar();
  const calendarRef = useRef(null);
  const initialCalendarView = "timeGridDay";
  const [view, setView] = useState(initialCalendarView);
  const [room, setRoom] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [newEventsDates, setNewEventsDates] = useState(null);
  const [newEventName, setNewEventName] = useState(null);

  const { mutateAsync: createBooking } = useCreateBooking();
  const { mutateAsync: deleteBooking } = useDeleteBooking();
  const { mutateAsync: updateBooking } = useUpdateBooking();

  function getBookingById(bookingId) {
    return bookings?.find((booking) => booking.id === bookingId);
  }

  const {
    data: users,
    isLoading: usersIsLoading,
    // isError: usersIsError,
    // refetch: refetchUsers,
  } = useUserList();

  const {
    data: bookings,
    isLoading: bookingsIsLoading,
    isError: bookingsIsError,
    refetch: refetchBookings,
  } = useBookingList({
    room__in: `${room}`,
  });

  const {
    data: rooms,
    isLoading: roomsIsLoading,
    isError: roomsIsError,
    refetch: refetchRooms,
  } = useRoomList();

  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
    refetch: refetchUser,
  } = useUser("me");

  useEffect(() => {
    if (!room) {
      console.log(rooms);
      rooms?.length > 0 && setRoom(rooms[0].id);
    }
  }, [rooms]);

  const bookingsForRoom =
    bookings?.filter((booking) => booking.room === room) || [];
  const events =
    bookingsForRoom.map((booking) => bookingToEvent(booking)) || [];

  async function handleDeleteBooking() {
    if (!selectedBooking) {
      enqueueSnackbar("No booking selected", { variant: "error" });
      return;
    }

    try {
      await deleteBooking({ uuid: selectedBooking });
      setSelectedBooking(null);
      enqueueSnackbar("Booking deleted", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`Error deleting booking: ${error.message}`, {
        variant: "error",
      });
      console.log(error);
    }
    resetState();
    refetchBookings();
  }

  const handleDateClick = async (dateClickInfo) => {
    console.log(dateClickInfo);
    refetchBookings();

    const {
      date,
      // jsEvent, view
    } = dateClickInfo;

    const end = dayjs(date).add(15, "minute").toDate();

    // // prevent adding event in the past
    // if (date < new Date()) {
    //   enqueueSnackbar("Event cannot be in the past", { variant: "error" });
    //   return;
    // }

    // check if there is an event in the clicked date hour
    if (
      events.find((event) => {
        if (dayjs(date).isBetween(dayjs(event.start), dayjs(event.end))) {
          return true;
        }
        if (dayjs(end).isBetween(dayjs(event.start), dayjs(event.end))) {
          return true;
        }
        return false;
      })
    ) {
      enqueueSnackbar("Event already exists at that room in that time range", {
        variant: "error",
      });
      return;
    }

    setNewEventsDates([dayjs(date), dayjs(date).add(1, "hour")]);
    setSelectedStartTime(date);
  };

  async function handleSubmitNewBooking() {
    console.log("submit");
    try {
      if (selectedBooking) {
        await updateBooking({
          uuid: selectedBooking,
          data: {
            start_time: newEventsDates[0],
            end_time: newEventsDates[1],
            description: newEventName || "Booking",
          },
        });
        enqueueSnackbar("Booking updated", { variant: "success" });
        resetState();
      } else {
        await createBooking({
          data: {
            start_time: newEventsDates[0],
            end_time: newEventsDates[1],
            description: newEventName || "Booking",
            room: room,
            tenant: selectedTenant,
          },
        });
      }
      enqueueSnackbar("Booking saved", { variant: "success" });
      resetState();
      setNewEventName(null);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(`Error saving booking: ${error.message}`, {
        variant: "error",
      });
    }
    refetchBookings();
  }

  function handleViewChange(view) {
    console.log(view);
    setView(view);
    if (view !== "list") {
      calendarRef.current && calendarRef.current.getApi().changeView(view);
    }
  }

  function validateNewEventDates() {
    const errors = [];
    if (!newEventsDates || newEventsDates.length !== 2) {
      return errors;
    }

    const start = dayjs(newEventsDates[0]);
    const end = dayjs(newEventsDates[1]);

    // should be later than now
    if (start.isBefore(dayjs())) {
      errors.push("The start date must be in the future");
    }

    // end should be anytime today
    if (end.isBefore(dayjs())) {
      errors.push("The end date must be in the future");
    }

    // should be at least 24 hours in the future
    if (start.isBefore(dayjs().add(24, "hour"))) {
      errors.push("The start date must be at least 24 hours in the future");
    }

    if (start.isAfter(end)) {
      errors.push("The start date must be before the end date");
    }

    events.forEach((event) => {
      if (event.resourceId == room && event.id !== selectedBooking) {
        if (
          dayjs(event.start).isBetween(start, end) ||
          dayjs(event.end).isBetween(start, end)
        ) {
          errors.push("There is already an event in that time range");
        }

        // check if they have a similar start and end time
        if (dayjs(event.start).isSame(start) || dayjs(event.end).isSame(end)) {
          errors.push("There is already an event in that time range");
        }
      }
    });

    return [...new Set(errors)];
  }

  const newEventErrors = validateNewEventDates() || [];

  function resetState() {
    setSelectedBooking(null);
    setSelectedStartTime(null);
    setNewEventsDates(null);
    setNewEventName(null);
    setSelectedTenant(null);
  }

  function handleEventClick(info) {
    const booking = getBookingById(info.event.id);
    if (!booking) {
      return;
    }
    setSelectedBooking(booking.id);
    setSelectedStartTime(dayjs(booking.start_time).toDate());
    setNewEventsDates([dayjs(booking.start_time), dayjs(booking.end_time)]);
    setNewEventName(booking.description);
  }

  // TODO: Move form to separate component

  return (
    <>
    <Typography.Title level={3} style={{ margin: "10px auto" }}>
      Calendar
    </Typography.Title>
    <div
      style={{
        height: "98dvh",
      }}
    >
      <Modal
        title={`Create a booking on ${dayjs(selectedStartTime).format(
          "dddd, MMMM Do"
        )}
        in room:  ${(rooms || []).find((rm) => rm.id === room)?.name || ""}
      
        `}
        open={!!selectedStartTime}
        onCancel={resetState}
        footer={[
          <Button key="back" onClick={resetState}>
            Cancel
          </Button>,
          <>
            {selectedBooking && (
              <Button danger onClick={handleDeleteBooking}>
                Delete
              </Button>
            )}
          </>,
          <Button
            key="submit"
            type="primary"
            // loading={loading}
            disabled={newEventErrors.length > 0}
            onClick={handleSubmitNewBooking}
          >
            Save
          </Button>,
        ]}
      >
        <Flex gap={4} vertical>
          <Text>Time range</Text>

          <TimePicker.RangePicker
            size="large"
            format="HH:mm"
            value={newEventsDates}
            minuteStep={15}
            onChange={(dates, dateStrings) => {
              setNewEventsDates(dates);
            }}
            status={newEventErrors.length ? "error" : ""}
            needConfirm={false}
          />
          <Flex gap={2} vertical>
            {newEventErrors.map((error, index) => (
              <Text key={index} type="danger">
                {error}
              </Text>
            ))}
          </Flex>

          <Text>Event name</Text>
          <Input
            placeholder="Event name"
            size="large"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
          />

          {user && user.is_admin && !selectedBooking && (
            <>
              <Text>Tenant</Text>
              <Select
                size="large"
                value={selectedTenant}
                onChange={(value) => setSelectedTenant(value)}
                options={
                  users?.map((tenant) => ({
                    value: tenant.id,
                    label: `${tenant.name}`,
                  })) || []
                }
              />
            </>
          )}
        </Flex>
      </Modal>
      <Modal
        title="Delete booking"
        // open={selectedBooking !== null}
        onOk={handleDeleteBooking}
        onCancel={() => setSelectedBooking(null)}
      >
        <p>Delete booking?</p>
        <p>
          This action cannot be undone. Please confirm that you want to delete
          this booking.
        </p>
      </Modal>
      <Flex justify="center" alignItems="center" gap={2}>
        <Select
          style={{ minWidth: 120 }}
          value={room}
          onChange={(value) => setRoom(value)}
          loading={roomsIsLoading}
          options={rooms?.map((room) => ({
            value: room.id,
            label: room.name,
          }))}
        />
        <Select
          style={{ minWidth: 120 }}
          defaultValue={initialCalendarView}
          onChange={(value) => handleViewChange(value)}
          options={[
            // { value: 'resourceTimelineWeek', label: 'ResourceTimelineWeek' },
            { value: "dayGridMonth", label: "Month view" },
            { value: "timeGridWeek", label: "Week view" },
            { value: "timeGridDay", label: "Day view" },
            { value: "list", label: "List view" },
          ]}
        />
      </Flex>

      <div style={{ height: "10px" }} />
      <Divider />
      {/* <div className='calendar-container'> */}

      {view === "list" ? (
        <>
          <Table
            style={{
              margin: "20px auto",
            }}
            dataSource={
              (bookings || []).filter((booking) => booking.room == room) || []
            }
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
                render: (text) =>
                  dayjs(text).format("dddd, MMMM Do YYYY, h:mm a"),
              },
              {
                title: "End Time",
                dataIndex: "end_time",
                key: "end_time",
                render: (text) =>
                  dayjs(text).format("dddd, MMMM Do YYYY, h:mm a"),
              },
            ]}
          />
        </>
      ) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[
            // resourceTimelinePlugin,
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
          ]}
          headerToolbar={{
            center: "",
            right: "title",
            left: "prev,next today",
            // right: 'resourceTimelineWeek,dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView={initialCalendarView}
          nowIndicator={true}
          editable={true}
          selectable={false}
          selectMirror={false}
          resources={rooms?.map((room) => ({
            id: room.id,
            title: room.name,
            // eventColor: room.color,
          }))}
          // initialEvents={events}
          events={events}
          dateClick={handleDateClick}
          height="100%"
          width="100%"
          selectAllow={() => console.log("select allow")}
          // validRange={() => {
          //   return {
          //     start: dayjs().subtract(2, "hour").toDate(),
          //     end: null
          //     // end: dayjs().add(5, "day").toDate(),
          //   };
          // }}
          eventDurationEditable={false}
          eventStartEditable={false}
          eventResizableFromStart={false}
          droppable={false}
          eventClick={handleEventClick}
        />
      )}
      {/* </div> */}
      </div>
    </>
  );
}
