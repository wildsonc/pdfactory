import { ActionIcon, Alert, Anchor, Button, Group, List, Modal, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconEdit, IconExternalLink, IconQuestionCircle, IconSearch, IconTrash } from "@tabler/icons";
import { DataTable } from "mantine-datatable";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import api from "../services/api";
import { formatDate } from "../services/formatDate";

interface Props {
  id: number;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
}

const Fonts = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [opened, handlers] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      id: 0,
      name: "",
      url: "",
    },
  });

  const { isLoading, data, refetch } = useQuery<Props[]>(
    "fonts",
    () =>
      api
        .get("/api/fonts")
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
          Delete font "<strong>{name}</strong>"
        </span>
      ),
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this font?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () =>
        api.delete(`api/fonts/${id}`).then((res) => {
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
        .put(`/api/fonts/${values.id}`, values)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          showNotification({
            title: "Error",
            message: err.message,
            color: "red",
          });
          setLoading(false);
        });
    } else {
      api
        .post("/api/fonts", values)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          showNotification({
            title: "Error",
            message: err.message,
            color: "red",
          });
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
          + Font
        </Button>
      </Group>
      <DataTable
        withBorder
        borderRadius="sm"
        highlightOnHover
        noRecordsText="No fonts"
        height="calc(100vh - 80px)"
        fetching={isLoading}
        records={data?.filter((e) => e.name.toLowerCase().includes(search))}
        columns={[
          {
            accessor: "id",
            title: "#",
            textAlignment: "center",
            width: 40,
          },
          {
            accessor: "name",
          },
          {
            accessor: "updated_at",
            textAlignment: "center",
            width: 160,
            render: ({ updated_at }) => moment(updated_at).fromNow(),
          },
          {
            accessor: "created_at",
            textAlignment: "center",
            width: 140,
            render: ({ created_at }) => formatDate(created_at),
          },
          {
            accessor: "actions",
            title: "",
            textAlignment: "center",
            width: 100,
            render: (data) => (
              <>
                <Group spacing={5} noWrap position="center">
                  <ActionIcon
                    color="blue.5"
                    onClick={() => {
                      form.setValues({ name: data.name, url: data.url, id: data.id });
                      handlers.open();
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon color="red.5" onClick={() => openDeleteModal(data.id, data.name)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </>
            ),
          },
        ]}
      />
      <Modal
        title={
          <Group spacing="xs">
            <Text>Fonts</Text>
            <ActionIcon
              color="blue.4"
              variant="light"
              component="a"
              href="https://fonts.google.com/"
              target="_blank"
              radius={50}
            >
              <IconExternalLink size={16} />
            </ActionIcon>
          </Group>
        }
        opened={opened}
        onClose={handlers.close}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Name" {...form.getInputProps("name")} required />
          <TextInput type="url" label="URL" {...form.getInputProps("url")} required />
          <Alert icon={<IconQuestionCircle size={20} />} title="How to" color="yellow" variant="outline" mt={20} p="xs">
            <List size="sm">
              <List.Item>
                Go to the{" "}
                <Anchor href="https://fonts.google.com" target="_blank">
                  Google Fonts
                </Anchor>
              </List.Item>
              <List.Item>
                In the right-hand sidebar, select the <strong>@import</strong> type and copy the URL.
              </List.Item>
              <List.Item>Paste the URL into the designated field.</List.Item>
            </List>
          </Alert>
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

export default Fonts;
