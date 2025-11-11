import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
  Button,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CreditCard as CardIcon,
  Settings as SystemIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const RecentActivitiesWidget = ({
  title = "Son Aktiviteler",
  maxItems = 5,
}) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.token;

      console.log("User kontrolü:", user ? "User var" : "User yok");
      console.log("Token kontrolü:", token ? "Token var" : "Token yok");
      console.log("API URL:", API_BASE_URL);

      if (!token) {
        setError("Giriş yapmanız gerekiyor");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/activities/recent`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setActivities(response.data.data.slice(0, maxItems));
      }
    } catch (error) {
      console.error("Son aktiviteler yüklenirken hata:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      if (error.response?.status === 401) {
        setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      } else if (error.response?.status === 403) {
        setError("Bu işlem için yetkiniz bulunmuyor.");
      } else if (error.response?.status === 500) {
        setError("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
      } else {
        setError("Aktiviteler yüklenirken bir hata oluştu");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, [maxItems]);

  const getActionIcon = (actionType, targetType) => {
    if (actionType === "login") return <LoginIcon color="primary" />;
    if (actionType === "logout") return <LogoutIcon color="secondary" />;

    const icons = {
      user: <PersonIcon />,
      card: <CardIcon />,
      company: <BusinessIcon />,
      system: <SystemIcon />,
    };
    return icons[targetType] || <SystemIcon />;
  };

  const getActionTypeColor = (actionType) => {
    const colors = {
      create: "success",
      update: "info",
      delete: "error",
      view: "default",
      login: "primary",
      logout: "secondary",
    };
    return colors[actionType] || "default";
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Az önce";
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} saat önce`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} gün önce`;

    return format(activityDate, "dd MMM yyyy", { locale: tr });
  };

  const handleViewAll = () => {
    // Kullanıcının rolüne göre doğru sayfaya yönlendir
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (user?.role === "admin") {
      navigate("/admin/activities");
    } else if (user?.role === "corporate") {
      navigate("/corporate/activities");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <List>
            {[...Array(3)].map((_, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="60%" />}
                  secondary={<Skeleton variant="text" width="40%" />}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <Tooltip title="Yenile">
            <span>
              <IconButton
                size="small"
                onClick={fetchRecentActivities}
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {activities.length === 0 && !loading && !error ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Henüz aktivite bulunmuyor
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {activities.map((activity, index) => (
              <ListItem
                key={activity.id}
                sx={{
                  px: 0,
                  borderBottom:
                    index < activities.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ width: 36, height: 36 }}>
                    {getActionIcon(activity.actionType, activity.targetType)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                      component="div"
                    >
                      <Typography variant="body2" component="span">
                        {activity.userName || "Bilinmeyen"}
                      </Typography>
                      <Chip
                        label={activity.actionType}
                        size="small"
                        // color={getActionTypeColor(activity.actionType)}
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box component="div">
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.8rem" }}
                        component="span"
                      >
                        {activity.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        component="span"
                      >
                        {formatTimeAgo(activity.createdAt)}
                      </Typography>
                    </Box>
                  }
                  primaryTypographyProps={{ component: "div" }}
                  secondaryTypographyProps={{ component: "div" }}
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Tümünü Gör Butonu */}
        {activities.length > 0 && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={handleViewAll}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Tümünü Gör
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesWidget;
