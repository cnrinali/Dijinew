import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Chip,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import BusinessIcon from "@mui/icons-material/Business";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import ThemeToggle from "../ThemeToggle";

const drawerWidth = 280;

const menuItems = [
  /* {
    id: "home",
    label: "Anasayfa",
    icon: <HomeIcon />,
    path: "/corporate",
    description: "Kurumsal ana panel",
  }, */
  {
    id: "dashboard",
    label: "Genel Bakış",
    icon: <DashboardIcon />,
    path: "/corporate/dashboard",
    description: "Dashboard ve istatistikler",
  },
  {
    id: "cards",
    label: "Kartvizitlerim",
    icon: <CardMembershipIcon />,
    path: "/corporate/cards",
    description: "Şirket kartvizitlerini yönet",
  },
  {
    id: "users",
    label: "Şirket Kullanıcıları",
    icon: <PeopleIcon />,
    path: "/corporate/users",
    description: "Şirket çalışanlarını yönet",
  },
  {
    id: "analytics",
    label: "İstatistikler",
    icon: <BarChartIcon />,
    path: "/analytics",
    description: "Şirket istatistikleri ve analizler",
  },
  {
    id: "activities",
    label: "Şirket Aktiviteleri",
    icon: <HistoryIcon />,
    path: "/corporate/activities",
    description: "Şirket aktivitelerini görüntüle",
  },
  // Geçici olarak gizlendi - dil desteği için gelecek versiyonlarda eklenecek
  // {
  //   id: 'settings',
  //   label: 'Ayarlar',
  //   icon: <SettingsIcon />,
  //   path: '/corporate/settings',
  //   description: 'Kurumsal ayarlar ve dil seçimi'
  // },
];

function CorporateLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getActiveItem = () => {
    const currentPath = location.pathname;
    if (currentPath === "/corporate") return "home";
    if (currentPath === "/corporate/dashboard") return "dashboard";
    if (currentPath.includes("/corporate/cards")) return "cards";
    if (currentPath.includes("/corporate/users")) return "users";
    if (currentPath === "/analytics") return "analytics";
    if (currentPath.includes("/corporate/activities")) return "activities";
    // Geçici olarak gizlendi - settings kontrolü kaldırıldı
    return "home";
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo Section - Minimal Kurumsal */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          background: "background.paper",
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
          }}
        >
          <img
            src={
              theme.palette.mode === "dark"
                ? "/img/dijinew_logo_light.png"
                : "/img/dijinew_logo_dark.png"
            }
            alt="Dijinew Logo"
            style={{
              height: "40px",
              width: "auto",
            }}
          />
        </Box>
      </Box>

      {/* Navigation Menu - Minimal Kurumsal */}
      <Box sx={{ flex: 1, py: 1 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = getActiveItem() === item.id;
            return (
              <ListItemButton
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.5,
                  px: 2,
                  position: "relative",
                  backgroundColor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "white" : "text.primary",
                  "&:hover": {
                    backgroundColor: isActive ? "primary.dark" : "action.hover",
                    color: isActive ? "white" : "text.primary",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "text.secondary",
                    minWidth: 36,
                    "& svg": {
                      fontSize: 18,
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.875rem",
                    color: "inherit",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: "100%",
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: "background.paper",
            color: "text.primary",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "grey.100",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ ml: 2, fontWeight: 600 }}
            >
              Kurumsal Panel
            </Typography>

            {/* Mobile User Menu */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ThemeToggle />
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  p: 0,
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: "#000000",
                    color: "#FFFFFF",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: "2px solid #FFD700",
                  }}
                >
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : user?.email?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            zIndex: theme.zIndex.drawer,
            backgroundColor: "background.paper",
            color: "text.primary",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar
              disableGutters
              sx={{
                minHeight: { xs: 56, sm: 64 },
                justifyContent: "space-between",
              }}
            >
              {/* Sol taraf - Boş alan */}
              <Box sx={{ flex: 1 }} />

              {/* Sağ taraf - User Menu */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ThemeToggle />

                {/* User Profile Dropdown */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{
                      p: 0,
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "#000000",
                        color: "#FFFFFF",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        border: "2px solid #FFD700",
                      }}
                    >
                      {user?.name
                        ? user.name.charAt(0).toUpperCase()
                        : user?.email?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
              boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
              boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        disablePortal={false}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {user?.name || "Kurumsal Kullanıcı"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {user?.email}
          </Typography>
        </Box>

        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            navigate("/profile");
          }}
          sx={{ py: 1.5, px: 2 }}
        >
          <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Profil
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            logout();
          }}
          sx={{
            py: 1.5,
            px: 2,
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.50",
            },
          }}
        >
          <ExitToAppIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Çıkış
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "grey.50",
          minHeight: "100vh",
          ml: isMobile ? 0 : 0,
          mt: isMobile ? 8 : 8, // Desktop için de header yüksekliği kadar margin
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default CorporateLayout;
