import {
  Center,
  createStyles,
  Navbar,
  Stack,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconArchive,
  IconHome2,
  IconLogout,
  IconMoon,
  IconScript,
  IconSettings,
  IconSun,
  IconTemplate,
  IconTypography,
  IconUsers,
  TablerIcon,
} from "@tabler/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const useStyles = createStyles((theme) => ({
  link: {
    width: 45,
    height: 45,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.dark[9],
    marginBottom: 5,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home", link: "/" },
  { icon: IconTemplate, label: "Templates", link: "/templates" },
  { icon: IconArchive, label: "Documents", link: "/documents" },
  { icon: IconTypography, label: "Fonts", link: "/fonts" },
  { icon: IconUsers, label: "Users", link: "/users" },
  { icon: IconSettings, label: "Settings", link: "/settings" },
];

export default function CustomNavbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { Logout, signed, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!signed) navigate("/login?redirect=" + pathname);
  }, [loading]);

  const pathname = window.location.pathname;
  const links = mockdata.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.link != "/" ? pathname.startsWith(link.link) : pathname == "/"}
      onClick={() => {
        navigate(link.link);
      }}
    />
  ));

  if (loading) return <></>;

  return (
    <Navbar height={"100%"} width={{ base: 65 }} p={10}>
      <Center>
        <ThemeIcon radius="lg" p={5} size="xl">
          <IconScript />
        </ThemeIcon>
      </Center>
      <Navbar.Section grow mt="xl">
        <Stack justify="center" spacing={0}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          <NavbarLink
            icon={colorScheme == "dark" ? IconSun : IconMoon}
            label={`${colorScheme == "dark" ? "Light" : "Dark"} mode`}
            onClick={() => toggleColorScheme()}
          />
          <NavbarLink icon={IconLogout} label="Logout" onClick={Logout} />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}
