import Layout from '../src/components/layout'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayjs from 'dayjs'
import { useBookingList, useCreateBooking } from '../src/api-client/bookings'
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

const defaultEvent = {
  resourceId: 'a',
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
  }
}

export default function CalendarPage() {
  const {
    data: bookings,
    isLoading: bookingsIsLoading,
    isError: bookingsIsError,
    refetch: refetchBookings,
  } = useBookingList()

  const events = bookings?.map((booking) => bookingToEvent(booking)) || []

  const { mutateAsync: createBooking } = useCreateBooking()

  // const {
  //   data: userProfile,
  //   isLoading: userProfileIsLoading,
  //   isError: userProfileIsError,
  //   refetch: refetchUserProfile,
  // } = useUserProfile("me");

  console.log('bookings', bookings)

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
        },
      })
    } catch (error) {
      console.log(error)
    }

    refetchBookings()
  }

  return (
    <Layout>
      <div
        style={{
          height: '98dvh',
        }}
      >
        {/* <div className='calendar-container'> */}
        <FullCalendar
          plugins={[
            // resourceTimelinePlugin,
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
          ]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'resourceTimelineWeek,dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView='timeGridDay'
          nowIndicator={true}
          editable={true}
          selectable={false}
          selectMirror={false}
          resources={[
            { id: 'a', title: 'Auditorium A' },
            { id: 'b', title: 'Auditorium B', eventColor: 'green' },
            { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
          ]}
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
            console.log('Event')
            console.log(info.event)
            console.log(info.event.id)
            console.log(JSON.stringify(info.event))
            // alert('Event: ' + info.event.title)
            // alert(
            //   'Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY
            // )
            // alert('View: ' + info.view.type)

            // change the border color just for fun
            info.el.style.borderColor = 'red'
          }}
        />
        {/* </div> */}
      </div>
    </Layout>
  )
}
