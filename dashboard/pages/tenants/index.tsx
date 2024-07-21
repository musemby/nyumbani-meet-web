import React from 'react'
import { Table, Tag } from 'antd'
import { useUserList } from '../../src/api-client/user'

const Users = () => {
  const {
    data: users,
    isLoading: usersIsLoading,
    // isError: usersIsError,
    // refetch: refetchUsers,
  } = useUserList()

  return (
    <>
      <Table
        style={{
          margin: '20px auto',
        }}
        dataSource={users || []}
        bordered
        title={() => 'Tenants'}
        loading={usersIsLoading}
        columns={[
          {
            title: 'Phone',
            dataIndex: 'phone_number',
            key: 'phone_number',
          },
          {
            title: 'Admin',
            dataIndex: 'is_admin',
            render: (text) =>
              text ? (
                <Tag color={'green'}>Yes</Tag>
              ) : (
                <Tag color={'red'}>No</Tag>
              ),
          },
        ]}
      />
    </>
  )
}

export default Users
