import { ActionIcon, Button, Group, PasswordInput, Tabs, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconApi, IconKey, IconRefresh, IconUser } from "@tabler/icons";
import { useEffect, useState } from "react";
import CopyButton from "../components/CopyButton";
import { useAuth } from "../context/auth";
import api from "../services/api";

const Settings = () => {
  const { user, UpdateUser } = useAuth();
  const [token, setToken] = useState("");
  const form = useForm({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
    },
  });
  const passForm = useForm({
    initialValues: {
      old_password: "",
      new_password1: "",
      new_password2: "",
    },
  });

  useEffect(() => {
    form.setValues({ ...user });
  }, [user]);

  useEffect(() => {
    api.get("/api/token").then((res) => setToken(res.data.token));
  }, []);

  const openModal = () =>
    openConfirmModal({
      title: <Text weight={600}>New token</Text>,
      children: (
        <>
          <Text color="red" weight={700}>
            This action will expire current token.
          </Text>
          <Text mt={5}>Are you sure you want to generate a new token?</Text>
        </>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => {},
      onConfirm: () => api.delete("/api/token").then((res) => setToken(res.data.token)),
    });

  const handleSubmit = (values: typeof form.values) => {
    UpdateUser(values);
    showNotification({ title: "Updated", color: "green", message: "" });
  };

  const changePassword = (values: typeof passForm.values) => {
    api
      .post("/auth/password/change/", values)
      .then((res) => {
        showNotification({ title: "Password changed", color: "green", message: "" });
      })
      .catch((err) => {
        if (err.response.data) {
          passForm.setErrors(err.response.data);
        }
      });
  };

  return (
    <>
      <Tabs defaultValue="account">
        <Tabs.List mb={5}>
          <Tabs.Tab value="account" icon={<IconUser size={14} />}>
            Account
          </Tabs.Tab>
          <Tabs.Tab value="api" icon={<IconKey size={14} />}>
            API
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="account" pl="xs" pt="xs">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput label="First name" {...form.getInputProps("first_name")} maw={400} required />
            <TextInput label="Last name" {...form.getInputProps("last_name")} maw={400} />
            <TextInput label="Email" {...form.getInputProps("email")} maw={400} disabled />
            <Button type="submit" mt={20} color="green">
              Save
            </Button>
          </form>
          <form onSubmit={passForm.onSubmit(changePassword)}>
            <PasswordInput
              label="Old password"
              {...passForm.getInputProps("old_password")}
              maw={300}
              mt={20}
              required
            />
            <PasswordInput label="New password" {...passForm.getInputProps("new_password1")} maw={300} required />
            <PasswordInput label="Repeat password" {...passForm.getInputProps("new_password2")} maw={300} required />
            <Button type="submit" mt={20}>
              Change password
            </Button>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="api" pl="xs" pt="xs">
          <TextInput
            label="Token"
            value={token}
            readOnly
            maw={420}
            icon={<IconApi size={20} />}
            rightSectionWidth={60}
            rightSection={
              <Group noWrap spacing={0}>
                <ActionIcon color="blue.5">
                  <IconRefresh size={18} onClick={openModal} />
                </ActionIcon>
                <CopyButton value={token} />
              </Group>
            }
          />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default Settings;
