import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import tableStyles from "./components/HtmlEditor/TableControl/Table.styles";
import { AuthProvider } from "./context/auth";
import { router } from "./router";
import { CustomFonts } from "./services/fonts";

const queryClient = new QueryClient();

const App = () => {
  const [cookies, setCookie] = useCookies(["colorScheme"]);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (!cookies.colorScheme) return;
    setColorScheme(cookies.colorScheme);
  }, [cookies]);

  const toggleColorScheme = (value?: ColorScheme) => {
    const newScheme = value || (isDark ? "light" : "dark");
    setCookie("colorScheme", newScheme);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
            globalStyles: (theme) => ({
              ".ProseMirror": { ...tableStyles(theme) },
            }),
            components: {
              Badge: {
                defaultProps: {
                  variant: isDark ? "light" : "outline",
                },
              },
            },
          }}
        >
          <CustomFonts />
          <Notifications position="bottom-right" containerWidth={250} />
          <ModalsProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
};

export default App;
