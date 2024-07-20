import React from 'react'
import { Table } from 'antd'
import { useRoomList } from '../../src/api-client/rooms'

const Rooms = () => {
  const {
    data: rooms,
    isLoading: roomsIsLoading,
    // isError: roomsIsError,
    // refetch: refetchRooms,
  } = useRoomList()

  return (
    <>
      <Table
        style={{
          margin: '20px auto',
        }}
        dataSource={rooms || []}
        bordered
        title={() => 'Rooms'}
        loading={roomsIsLoading}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
          },
        ]}
      />
    </>
  )
}

export default Rooms
