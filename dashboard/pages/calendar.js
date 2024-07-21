import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayjs from 'dayjs'
import {
  useBookingList,
  useCreateBooking,
  useDeleteBooking,
} from '../src/api-client/bookings'
import { useUser } from '../src/api-client/user'
import { useRoomList } from '../src/api-client/rooms'
import { useEffect, useRef, useState } from 'react'
import { Select, Flex, Divider, Modal } from 'antd'
import { useSnackbar } from 'notistack'

var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

const defaultEvent = {
  editable: false,
  overlap: false,
}

function bookingToEvent(booking) {
  return {
    ...defaultEvent,
    id: booking.id,
    title: booking.description,
    start: dayjs(booking.start_time).toDate(),
    end: dayjs(booking.end_time).toDate(),
    resourceId: booking.room,
  }
}

export default function CalendarPage() {
  const { enqueueSnackbar } = useSnackbar()
  const calendarRef = useRef(null)
  const initialCalendarView = 'timeGridDay'
  const [room, setRoom] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const { mutateAsync: createBooking } = useCreateBooking()
  const { mutateAsync: deleteBooking } = useDeleteBooking()

  function getBookingById(bookingId) {
    return bookings?.find((booking) => booking.id === bookingId)
  }

  const {
    data: bookings,
    isLoading: bookingsIsLoading,
    isError: bookingsIsError,
    refetch: refetchBookings,
  } = useBookingList()

  const {
    data: rooms,
    isLoading: roomsIsLoading,
    isError: roomsIsError,
    refetch: refetchRooms,
  } = useRoomList()

  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
    refetch: refetchUser,
  } = useUser('me')

  console.log('user', user)

  useEffect(() => {
    if (!room) {
      rooms?.length > 0 && setRoom(rooms[0].id)
    }
  }, [rooms])

  const bookingsForRoom =
    bookings?.filter((booking) => booking.room === room) || []
  const events = bookingsForRoom.map((booking) => bookingToEvent(booking)) || []

  async function handleDeleteBooking() {
    if (!selectedBooking) {
      enqueueSnackbar('No booking selected', { variant: 'error' })
      return
    }

    try {
      await deleteBooking({ uuid: selectedBooking })
      setSelectedBooking(null)
      enqueueSnackbar('Booking deleted', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(`Error deleting booking: ${error.message}`, {
        variant: 'error',
      })
      console.log(error)
    }
    refetchBookings()
  }

  const handleDateClick = async (dateClickInfo) => {
    console.log(dateClickInfo)

    const {
      date,
      // jsEvent, view
    } = dateClickInfo
    const end = dayjs(date).add(1, 'hour').toDate()

    // prevent adding event in the past
    if (date < new Date()) {
      enqueueSnackbar('Event cannot be in the past', { variant: 'error' })
      return
    }

    // check if there is an event in the clicked date hour
    if (
      events.find((event) => {
        if (dayjs(date).isBetween(dayjs(event.start), dayjs(event.end))) {
          return true
        }
        if (dayjs(end).isBetween(dayjs(event.start), dayjs(event.end))) {
          return true
        }
        return false
      })
    ) {
      enqueueSnackbar('Event already exists at that room in that time range', {
        variant: 'error',
      })
      return
    }

    // if there is no event, add one for 1 hour

    try {
      await createBooking({
        data: {
          start_time: date,
          end_time: end,
          description: 'tenant 1 booking',
          room: room,
        },
      })
    } catch (error) {
      console.log(error)
      enqueueSnackbar(`Error creating booking: ${error.message}`, {
        variant: 'error',
      })
    }

    refetchBookings()
  }

  function handleViewChange(view) {
    console.log(view)
    calendarRef.current && calendarRef.current.getApi().changeView(view)
  }

  return (
    <div
      style={{
        height: '98dvh',
      }}
    >
      <Modal
        title='Delete booking'
        open={selectedBooking !== null}
        onOk={handleDeleteBooking}
        onCancel={() => setSelectedBooking(null)}
      >
        <p>Delete booking?</p>
        <p>
          This action cannot be undone. Please confirm that you want to delete
          this booking.
        </p>
      </Modal>
      <Flex justify='center' alignItems='center' gap={2}>
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
            { value: 'dayGridMonth', label: 'Month view' },
            { value: 'timeGridWeek', label: 'Week view' },
            { value: 'timeGridDay', label: 'Day view' },
          ]}
        />
      </Flex>

      <div style={{ height: '10px' }} />
      <Divider />
      {/* <div className='calendar-container'> */}
      <FullCalendar
        ref={calendarRef}
        plugins={[
          // resourceTimelinePlugin,
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin,
        ]}
        headerToolbar={{
          center: '',
          right: 'title',
          left: 'prev,next today',
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
        height='100%'
        width='100%'
        selectAllow={() => console.log('select allow')}
        validRange={() => {
          return {
            start: dayjs().subtract(2, 'hour').toDate(),
            end: dayjs().add(5, 'day').toDate(),
          }
        }}
        eventDurationEditable={false}
        eventStartEditable={false}
        eventResizableFromStart={false}
        droppable={false}
        eventClick={(info) => {
          const booking = getBookingById(info.event.id)
          booking && setSelectedBooking(booking.id)
        }}
      />
      {/* </div> */}
    </div>
  )
}
