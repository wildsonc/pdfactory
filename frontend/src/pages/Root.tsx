import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Root = () => {
  return (
    <AppShell
      padding="md"
      navbar={<Navbar />}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme == "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <div id="detail">
        <Outlet />
      </div>
    </AppShell>
  );
};

export default Root;
