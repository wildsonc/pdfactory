import { ActionIcon, Group, Text, TypographyStylesProvider } from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconExternalLink, IconEye, IconTrash } from "@tabler/icons";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import api from "../services/api";
import { formatDate } from "../services/formatDate";

interface Documents {
  id: number;
  template: string;
  html: string;
  file_url: string;
  created_at: string;
}

interface Props {
  count: number;
  next: string | null;
  previous: string | null;
  results: Documents[];
}

const PAGE_SIZES = [10, 20, 50, 100];

const Documents = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);

  const { isLoading, data, refetch } = useQuery<Props>(
    "documents",
    () =>
      api
        .get(`/api/documents?page=${page}&page_size=${pageSize}`)
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

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const openDeleteModal = (id: number, name: string) =>
    openConfirmModal({
      title: (
        <span>
          Delete document "<strong>{name}</strong>"
        </span>
      ),
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this document?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () =>
        api.delete(`api/documents/${id}`).then((res) => {
          refetch();
          showNotification({
            title: name,
            message: "Deleted",
            color: "red",
          });
        }),
    });

  const openPreviewModal = (html: string) =>
    openModal({
      size: "xl",
      children: (
        <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </TypographyStylesProvider>
      ),
    });

  return (
    <>
      <DataTable
        withBorder
        borderRadius="sm"
        highlightOnHover
        minHeight={(data?.results.length || 0) > 0 ? undefined : 200}
        height="calc(100vh - 35px)"
        noRecordsText="No documents"
        recordsPerPageLabel="Documents per page"
        fetching={isLoading}
        records={data?.results}
        recordsPerPage={pageSize}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        page={page}
        totalRecords={data?.count ?? 0}
        onPageChange={(p) => setPage(p)}
        columns={[
          {
            accessor: "id",
            title: "#",
            textAlignment: "center",
            width: 60,
          },
          {
            accessor: "template",
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
            width: 140,
            render: (data) => (
              <>
                <Group spacing={5} noWrap position="center">
                  <ActionIcon
                    component="a"
                    color="blue.5"
                    href={data.file_url}
                    disabled={data.file_url == ""}
                    target="_blank"
                  >
                    <IconExternalLink size={16} />
                  </ActionIcon>
                  <ActionIcon color="green.5" onClick={() => openPreviewModal(data.html)}>
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon color="red.5" onClick={() => openDeleteModal(data.id, String(data.id))}>
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

export default Documents;
