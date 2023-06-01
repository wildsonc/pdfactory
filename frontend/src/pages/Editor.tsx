import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Grid,
  Group,
  HoverCard,
  Kbd,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { getHotkeyHandler, useElementSize } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import {
  IconBrandCss3,
  IconBrandHtml5,
  IconChevronLeft,
  IconCode,
  IconEdit,
  IconHelpCircle,
  IconSettings,
  IconVariable,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import CssEditor from "../components/CssEditor";
import RichHtmlEditor from "../components/HtmlEditor";
import JsonEditor from "../components/JsonEditor";
import Preview from "../components/Preview";
import Settings from "../components/Settings";
import { TemplateFormProvider, useTemplateForm } from "../context/form-context";
import api from "../services/api";

const Editor = () => {
  let { pk } = useParams();
  const { ref, height } = useElementSize();
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [fileURL, setFileURL] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useTemplateForm({
    initialValues: {
      name: "My Template",
      html: "",
      css: "",
      json: "{}",
      settings: {
        highlight_variables: true,
        page_size: "A4",
        orientation: "portrait",
        margin_unit: "px",
        margin_top: "40",
        margin_right: "50",
        margin_bottom: "40",
        margin_left: "50",
        background: false,
        background_color: "#ffffff",
        header: false,
        footer: false,
        header_template: "",
        footer_template: "",
      },
    },
  });

  useEffect(() => {
    const handler = getHotkeyHandler([["mod+shift+Enter", () => preview()]]);
    document.body.addEventListener("keydown", handler);

    return () => {
      document.body.removeEventListener("keydown", handler);
    };
  }, [form.values]);

  useEffect(() => {
    if (!pk) return;
    if (pk == "new") return;
    api
      .get(`/api/templates/${pk}`)
      .then((res) => {
        form.setValues(res.data);
        preview(res.data);
        form.resetDirty(res.data);
      })
      .catch((err) => {
        if (err.response.status == 404) {
          navigate("/templates/new");
        } else {
          showNotification({
            title: "Error",
            message: err.message,
            color: "red",
          });
        }
      });
  }, [pk]);

  const regex = /{{(.*?)}}/g;
  let match;
  let vars = [];
  while ((match = regex.exec(form.values.html))) {
    vars.push(match[1].split("|")[0]);
  }

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    if (values.id) {
      api
        .put(`/api/templates/${values.id}`, values)
        .then((res) => {
          form.resetDirty(values);
          showNotification({
            title: "Success",
            message: "Template updated",
            color: "blue",
          });
        })
        .catch((err) => {
          showNotification({
            title: "Error",
            message: err.message,
            color: "red",
          });
        })
        .finally(() => setLoading(false));
    } else {
      api
        .post("/api/templates", values)
        .then((res) => {
          form.setFieldValue("id", res.data.id);
          window.history.replaceState("", "", `/templates/${res.data.id}`);
          form.resetDirty(values);
          showNotification({
            title: "Success",
            message: "Template created",
            color: "green",
          });
        })
        .catch((err) => {
          showNotification({
            title: "Error",
            message: err.message,
            color: "red",
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const preview = (data: typeof form.values | undefined = undefined) => {
    let json = {};
    const values = data || form.values;
    try {
      json = values.json != "" ? JSON.parse(values.json) : {};
    } catch (err) {
      showNotification({
        title: "Error",
        message: "Invalid JSON",
        color: "red",
      });
      return;
    }
    setPreviewLoading(true);
    api
      .post(
        "/api/preview",
        {
          ...values,
          json,
        },
        { responseType: "blob" }
      )
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        setFileURL(url);
      })
      .catch((err) => {
        err.response.data.text().then((res: any) =>
          showNotification({
            title: "Error",
            message: JSON.parse(res).message,
            color: "red",
          })
        );
      })
      .finally(() => setPreviewLoading(false));
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: <strong>Delete template</strong>,
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete this template?</Text>
      ),
      labels: { confirm: "Delete template", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onConfirm: () =>
        api.delete(`/api/templates/${form.values?.id}`).then((res) => {
          showNotification({
            message: "Deleted",
            color: "red",
          });
          queryClient.invalidateQueries("templates");
          navigate("/templates");
        }),
    });

  if (pk != "new" && !form.values.id) return <></>;

  return (
    <>
      <TemplateFormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group position="apart">
            <Group spacing={2}>
              <IconEdit size={16} />
              <TextInput
                {...form.getInputProps("name")}
                required
                variant="unstyled"
                styles={(theme) => ({
                  input: {
                    fontWeight: 600,
                    color: theme.colorScheme == "dark" ? "white" : "black",
                    paddingLeft: theme.spacing.xs,

                    "&:hover": {
                      background:
                        theme.colorScheme == "dark"
                          ? theme.colors.dark[6]
                          : theme.colors.gray[2],
                      borderRadius: theme.radius.sm,
                    },
                  },
                })}
                maxLength={100}
              />
            </Group>
            <Group spacing="xs" mt={-15}>
              <Button
                compact
                variant="default"
                onClick={() => {
                  queryClient.invalidateQueries("templates");
                  navigate("/templates");
                }}
                leftIcon={<IconChevronLeft size={16} />}
              >
                Back to list
              </Button>
              <Button
                compact
                color="red"
                onClick={openDeleteModal}
                disabled={!form.values?.id}
              >
                Delete
              </Button>
              <Button
                compact
                color="green"
                type="submit"
                loading={loading}
                disabled={form.values.html == "" || !form.isDirty()}
              >
                Save
              </Button>
            </Group>
          </Group>
          <Grid h="calc(100vh - 70px)">
            <Grid.Col lg={6} sm={12} h={height}>
              <Tabs defaultValue="template" h="100%">
                <Tabs.List grow>
                  <Tabs.Tab
                    value="template"
                    icon={<IconBrandHtml5 size={16} />}
                  >
                    Template
                  </Tabs.Tab>
                  <Tabs.Tab value="css" icon={<IconBrandCss3 size={16} />}>
                    CSS
                  </Tabs.Tab>
                  <Tabs.Tab value="json" icon={<IconCode size={16} />}>
                    JSON
                  </Tabs.Tab>
                  <Tabs.Tab value="settings" icon={<IconSettings size={16} />}>
                    Settings
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="template" pt="xs">
                  <RichHtmlEditor height={height} />
                </Tabs.Panel>

                <Tabs.Panel value="css" pt="xs">
                  <CssEditor height={height} />
                </Tabs.Panel>

                <Tabs.Panel value="json" pt="xs">
                  <JsonEditor height={height} />
                </Tabs.Panel>
                <Tabs.Panel value="settings" pt="xs">
                  <Settings height={height} />
                </Tabs.Panel>
              </Tabs>
            </Grid.Col>
            <Grid.Col lg={6} sm={12} mah="100%">
              <Group noWrap spacing="xs">
                <Button
                  fullWidth
                  onClick={() => preview()}
                  loading={previewLoading}
                  variant="outline"
                  rightIcon={
                    <Flex align="center" my="xs">
                      <Kbd size="xs">Ctrl</Kbd>
                      <Kbd ml={3} size="xs">
                        Shift
                      </Kbd>
                      <Kbd ml={3} size="xs">
                        Enter
                      </Kbd>
                    </Flex>
                  }
                >
                  Preview
                </Button>
                <HoverCard shadow="md">
                  <HoverCard.Target>
                    <ActionIcon variant="filled" size="lg">
                      <IconVariable size={20} />
                    </ActionIcon>
                  </HoverCard.Target>
                  <HoverCard.Dropdown p="xs">
                    <Text color="dimmed" ta="center" mt={-5} size="sm">
                      Variables
                    </Text>
                    {[...new Set(vars)].sort().map((v) => (
                      <Text size="sm" key={v}>
                        {v}
                      </Text>
                    ))}
                  </HoverCard.Dropdown>
                </HoverCard>
                <ActionIcon
                  component="a"
                  href="https://docs.djangoproject.com/en/dev/ref/templates/builtins"
                  target="_blank"
                  color="yellow"
                  variant="outline"
                  size="lg"
                >
                  <IconHelpCircle size={20} />
                </ActionIcon>
              </Group>
              <Box h="calc(100% - 40px)" ref={ref} mt="xs">
                <Preview url={fileURL} />
              </Box>
            </Grid.Col>
          </Grid>
        </form>
      </TemplateFormProvider>
    </>
  );
};

export default Editor;
