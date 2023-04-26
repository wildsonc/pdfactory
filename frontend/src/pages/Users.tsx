import { ActionIcon, Badge, Button, Group, Modal, PasswordInput, Switch, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons";
import { DataTable } from "mantine-datatable";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import api from "../services/api";
import { formatDate } from "../services/formatDate";

interface Props {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_staff: boolean;
  last_login: string | null;
  date_joined: string;
}

const Users = () => {
  const [search, setSearch] = useState("");
  const [opened, handlers] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      id: 0,
      username: "",
      first_name: "",
      last_name: "",
      is_active: true,
      is_staff: false,
      email: "",
      password: "",
    },
  });

  const { isLoading, data, refetch } = useQuery<Props[]>(
    "users",
    () =>
      api
        .get("/api/users")
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          showNotification({
            title: "Error",
            message: err.message,
            color: "red",
          });
        }),
    { staleTime: 1000 * 60 }
  );

  const openDeleteModal = (id: number, name: string) =>
    openConfirmModal({
      title: (
        <span>
          Delete user "<strong>{name}</strong>"
        </span>
      ),
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this user?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () =>
        api.delete(`api/users/${id}`).then((res) => {
          refetch();
          showNotification({
            title: name,
            message: "Deleted",
            color: "red",
          });
        }),
    });

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    if (values.id != 0) {
      api
        .put(`/api/users/${values.id}`, values)
        .then((res) => {
          setLoading(false);
          refetch();
          handlers.close();
        })
        .catch((err) => {
          showNotification({ title: "Error", message: err.message, color: "red" });
          setLoading(false);
        });
    } else {
      api
        .post("/api/users", values)
        .then((res) => {
          setLoading(false);
          refetch();
          handlers.close();
        })
        .catch((err) => {
          if (err.response.data) {
            form.setErrors(err.response.data);
          }
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Group position="apart" mb="xs" noWrap>
        <TextInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<IconSearch size={16} />}
          placeholder="Search..."
          w={"100%"}
        />
        <Button
          onClick={() => {
            form.reset();
            handlers.open();
          }}
        >
          + User
        </Button>
      </Group>
      <DataTable
        borderRadius="sm"
        withBorder
        highlightOnHover
        fetching={isLoading}
        height="calc(100vh - 80px)"
        noRecordsText="No users"
        records={data?.filter((e) => e.email.toLowerCase().includes(search))}
        columns={[
          {
            accessor: "id",
            title: "#",
            textAlignment: "center",
            width: 40,
          },
          {
            accessor: "is_active",
            title: "Status",
            textAlignment: "center",
            width: 100,
            render: ({ is_active }) =>
              is_active ? <Badge color="green">Active</Badge> : <Badge color="red">Inactive</Badge>,
          },
          { accessor: "name", render: (data) => `${data.first_name} ${data.last_name}`, width: 200, ellipsis: true },
          { accessor: "email" },
          {
            accessor: "last_login",
            textAlignment: "center",
            width: 160,
            render: ({ last_login }) => (last_login ? moment(last_login).fromNow() : "-"),
          },
          {
            accessor: "date_joined",
            textAlignment: "center",
            width: 120,
            render: ({ date_joined }) => formatDate(date_joined, false),
          },
          {
            accessor: "",
            textAlignment: "center",
            width: 130,
            render: (data) => (
              <>
                <Group spacing={5} noWrap position="center">
                  <ActionIcon
                    color="blue.5"
                    disabled={data.is_superuser}
                    onClick={() => {
                      form.setValues({ ...data });
                      handlers.open();
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red.5"
                    disabled={data.is_superuser}
                    onClick={() => openDeleteModal(data.id, data.email)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </>
            ),
          },
        ]}
      />

      <Modal title={form.values.id ? "Update user" : "New user"} opened={opened} onClose={handlers.close}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Username" {...form.getInputProps("username")} required />
          <TextInput label="Email" type="email" {...form.getInputProps("email")} required />
          <TextInput label="First Name" {...form.getInputProps("first_name")} required />
          <TextInput label="Last Name" {...form.getInputProps("last_name")} />
          {form.values.id ? (
            <></>
          ) : (
            <>
              <PasswordInput label="Password" {...form.getInputProps("password")} minLength={8} />
            </>
          )}
          <Switch label="Staff" {...form.getInputProps("is_staff", { type: "checkbox" })} mt={10} />
          <Switch label="Active" {...form.getInputProps("is_active", { type: "checkbox" })} mt={10} />
          <Group position="right" mt={20}>
            <Button variant="default" onClick={handlers.close}>
              Cancel
            </Button>
            <Button color="green" type="submit" loading={loading}>
              Save
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Users;
