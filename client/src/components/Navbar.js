import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navItems = [
    { label: "Employees", path: "/" },
    { label: "Departments", path: "/departments" },
    { label: "Projects", path: "/projects" },
    { label: "Tasks", path: "/tasks" },
    { label: "Attendance", path: "/attendance" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        background: "linear-gradient(90deg, #0f172a, #1e293b)",
        color: "#fff",
        borderRadius: 2,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <TaskAltIcon sx={{ color: "#38bdf8", fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Trakify
          </Typography>
        </Box>

        {!isMobile && (
          <Box display="flex" gap={2}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: "#e2e8f0",
                  fontWeight: 500,
                  position: "relative",
                  transition: "0.3s",
                  "&:hover": {
                    color: "#38bdf8",
                    background: "transparent",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: location.pathname === item.path ? "100%" : "0%",
                    height: "2px",
                    backgroundColor: "#38bdf8",
                    transition: "width 0.3s",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
