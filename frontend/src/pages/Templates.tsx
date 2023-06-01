import { ActionIcon, Button, Group, Text, TextInput } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCopy, IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatDate } from "../services/formatDate";

interface Props {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

const Templates = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { isLoading, data, refetch } = useQuery<Props[]>(
    "templates",
    () =>
      api
        .get("/api/templates")
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
          Delete template "<strong>{name}</strong>"
        </span>
      ),
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete this template?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () =>
        api.delete(`api/templates/${id}`).then((res) => {
          refetch();
          showNotification({
            title: name,
            message: "Deleted",
            color: "red",
          });
        }),
    });

  const openCloneModal = (data: Props) =>
    openConfirmModal({
      title: (
        <span>
          Clone template "<strong>{data.name}</strong>"
        </span>
      ),
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to clone this template?</Text>
      ),
      labels: { confirm: "Clone", cancel: "Cancel" },
      confirmProps: { color: "blue" },
      onCancel: () => {},
      onConfirm: () =>
        api
          .post(`api/templates`, { ...data, name: data.name + " (copy)" })
          .then((res) => {
            refetch();
            showNotification({
              title: data.name,
              message: "Cloned",
              color: "green",
            });
          }),
    });

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
        <Button onClick={() => navigate("/templates/new")}>+ Template</Button>
      </Group>
      <DataTable
        borderRadius="sm"
        withBorder
        highlightOnHover
        fetching={isLoading}
        height="calc(100vh - 80px)"
        noRecordsText="No templates"
        records={data?.filter((e) => e.name.toLowerCase().includes(search))}
        columns={[
          {
            accessor: "id",
            title: "#",
            textAlignment: "center",
            width: 40,
          },
          { accessor: "name" },
          {
            accessor: "updated_at",
            textAlignment: "center",
            width: 160,
            render: ({ updated_at }) => moment(updated_at).fromNow(),
          },
          {
            accessor: "created_at",
            textAlignment: "center",
            width: 120,
            render: ({ created_at }) => formatDate(created_at, false),
          },
          {
            accessor: "",
            textAlignment: "center",
            width: 130,
            render: (data) => (
              <>
                <Group spacing={5} noWrap position="center">
                  <ActionIcon onClick={() => navigate(String(data.id))}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="blue.5"
                    onClick={() => openCloneModal(data)}
                  >
                    <IconCopy size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red.5"
                    onClick={() => openDeleteModal(data.id, data.name)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </>
            ),
          },
        ]}
      />
    </>
  );
};

export default Templates;
