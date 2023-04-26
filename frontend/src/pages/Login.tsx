import { Button, Container, Paper, PasswordInput, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/auth";

export function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { Login, signed, loading } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (loading) return;
    if (signed) navigate(searchParams.get("redirect") || "/");
  }, [loading, signed]);

  const handleSubmit = (values: typeof form.values) => {
    setIsLoading(true);
    Login(values)
      .then((res) => {
        navigate(searchParams.get("redirect") || "/");
      })
      .catch((error) => {
        if (error.response?.data?.email) {
          form.setFieldError("email", error.response.data.email[0]);
        } else {
          form.setFieldError("password", error.response?.data?.non_field_errors[0]);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
        PDFactory
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Email" type="email" placeholder="you@gmail.com" required {...form.getInputProps("email")} />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
