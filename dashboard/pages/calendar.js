import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayjs from 'dayjs'
import { useBookingList, useCreateBooking } from '../src/api-client/bookings'
import { useRoomList } from '../src/api-client/rooms'
import { useEffect, useRef, useState } from 'react'
import { Select, Flex, Divider } from 'antd'

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
  const calendarRef = useRef(null)
  const initialCalendarView = 'timeGridDay'
  const [room, setRoom] = useState(null)

  const { mutateAsync: createBooking } = useCreateBooking()

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

  useEffect(() => {
    if (!room) {
      rooms?.length > 0 && setRoom(rooms[0].id)
    }
  }, [rooms])

  const bookingsForRoom =
    bookings?.filter((booking) => booking.room === room) || []
  const events = bookingsForRoom.map((booking) => bookingToEvent(booking)) || []

  const handleDateClick = async (dateClickInfo) => {
    console.log(dateClickInfo)

    const {
      date,
      // jsEvent, view
    } = dateClickInfo

    // prevent adding event in the past
    if (date < new Date()) {
      alert('Event cannot be in the past')

      return
    }

    // check if there is an event in the clicked date hour
    if (
      events.find((event) => {
        if (dayjs(date).isBetween(dayjs(event.start), dayjs(event.end))) {
          return true
        }
        return false
      })
    ) {
      alert('Event already exists')

      return
    }

    // if there is no event, add one for 1 hour
    const end = dayjs(date).add(1, 'hour').toDate()

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
      <Flex justify='center' alignItems='center' gap={2}>
        <Select
          // defaultValue='lucy'
          // style={{ width: 120 }}
          value={room}
          onChange={(value) => setRoom(value)}
          loading={roomsIsLoading}
          options={rooms?.map((room) => ({
            value: room.id,
            label: room.name,
          }))}
        />
        <Select
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
          console.log(info)
        }}
      />
      {/* </div> */}
    </div>
  )
}
