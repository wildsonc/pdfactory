import { ActionIcon, Button, Grid, Group, Tabs, TextInput } from "@mantine/core";
import { useElementSize, useHotkeys } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconBrandCss3, IconBrandHtml5, IconCode, IconEdit, IconEye, IconSettings } from "@tabler/icons";
import { useEffect, useState } from "react";
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [fileURL, setFileURL] = useState("");
  const { ref, height } = useElementSize();
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
  useHotkeys([["mod+shift+Enter", () => preview()]]);

  useEffect(() => {
    if (!pk) return;
    if (pk == "new") return;
    api
      .get(`/api/templates/${pk}`)
      .then((res) => {
        form.setValues(res.data);
        preview(res.data);
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

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    if (values.id) {
      api
        .put(`/api/templates/${values.id}`, values)
        .then((res) => {
          setLoading(false);
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
          setLoading(false);
        });
    } else {
      api
        .post("/api/templates", values)
        .then((res) => {
          form.setFieldValue("id", res.data.id);
          window.history.replaceState("", "", `/templates/${res.data.id}`);
          setLoading(false);
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
          setLoading(false);
        });
    }
  };

  const preview = (data: typeof form.values | undefined = undefined) => {
    let json = {};
    const values = data || form.values;
    try {
      json = values.json != "" ? JSON.parse(values.json) : {};
    } catch (err) {
      showNotification({ title: "Error", message: "Invalid JSON", color: "red" });
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
        setPreviewLoading(false);
      })
      .catch((err) => {
        setPreviewLoading(false);
        err.response.data.text().then((res: any) =>
          showNotification({
            title: "Error",
            message: JSON.parse(res).message,
            color: "red",
          })
        );
      });
  };

  if (pk != "new" && !form.values.id) return <></>;

  return (
    <>
      <TemplateFormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group position="apart">
            <TextInput
              {...form.getInputProps("name")}
              required
              w={350}
              variant="unstyled"
              styles={(theme) => ({
                input: { fontWeight: 600, color: theme.colorScheme == "dark" ? "white" : "black" },
              })}
              icon={
                <ActionIcon>
                  <IconEdit size={16} />
                </ActionIcon>
              }
              maxLength={100}
            />
            <Group spacing="xs">
              <Button compact variant="default" onClick={() => navigate("/templates")}>
                Back
              </Button>
              <Button compact color="green" type="submit" loading={loading}>
                Save
              </Button>
            </Group>
          </Group>
          <Grid h="calc(100vh - 70px)">
            <Grid.Col lg={6} sm={12} h={height}>
              <Tabs defaultValue="template" h="100%">
                <Tabs.List grow>
                  <Tabs.Tab value="template" icon={<IconBrandHtml5 size={14} />}>
                    Template
                  </Tabs.Tab>
                  <Tabs.Tab value="css" icon={<IconBrandCss3 size={14} />}>
                    CSS
                  </Tabs.Tab>
                  <Tabs.Tab value="json" icon={<IconCode size={14} />}>
                    JSON
                  </Tabs.Tab>
                  <Tabs.Tab value="settings" icon={<IconSettings size={14} />}>
                    Settings
                  </Tabs.Tab>
                  <Button compact ml={5} onClick={() => preview()} loading={previewLoading}>
                    Preview
                  </Button>
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
              <Tabs defaultValue="preview" h="100%">
                <Tabs.List grow>
                  <Tabs.Tab value="preview" icon={<IconEye size={14} />}>
                    Preview
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="preview" pt="xs" h="calc(100% - 40px)" ref={ref}>
                  <Preview url={fileURL} />
                </Tabs.Panel>
              </Tabs>
            </Grid.Col>
          </Grid>
        </form>
      </TemplateFormProvider>
    </>
  );
};

export default Editor;
