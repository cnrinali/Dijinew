import React, { useState, useEffect } from "react";
import userService from "../../services/userService";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";
import axios from "axios";

// MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";

function CorporateProfilePage() {
  const { updateAuthUser } = useAuth();
  const { showNotification } = useNotification();

  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [companyData, setCompanyData] = useState({
    name: "",
    phone: "",
    website: "",
    address: "",
    userLimit: 0,
    cardLimit: 0,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [tabIndex, setTabIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [companyUpdateLoading, setCompanyUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profil ve şirket bilgilerini çek
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Kullanıcı profil bilgilerini al
        const userData = await userService.getUserProfile();
        setProfileData({
          name: userData.name,
          email: userData.email,
        });

        // Şirket bilgilerini al
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        const companyResponse = await axios.get("/api/corporate/company", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanyData({
          name: companyResponse.data.name || "",
          phone: companyResponse.data.phone || "",
          website: companyResponse.data.website || "",
          address: companyResponse.data.address || "",
          userLimit: companyResponse.data.userLimit || 0,
          cardLimit: companyResponse.data.cardLimit || 0,
        });
      } catch (err) {
        console.error("Veri getirilirken hata:", err);
        showNotification(
          err.response?.data?.message || "Veriler yüklenemedi.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showNotification]);

  // Profil formu için input değişikliği
  const onProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Şirket formu için input değişikliği
  const onCompanyChange = (e) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  // Şifre formu için input değişikliği
  const onPasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Sekme değişikliği handler
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Profil güncelleme submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const updatedUser = await userService.updateUserProfile(profileData);
      setProfileData({
        name: updatedUser.name,
        email: updatedUser.email,
      });
      updateAuthUser({
        name: updatedUser.name,
        email: updatedUser.email,
      });
      showNotification("Profil bilgileri başarıyla güncellendi.", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Profil güncellenemedi.";
      showNotification(errorMsg, "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Şirket bilgileri güncelleme submit
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setCompanyUpdateLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      const response = await axios.put("/api/corporate/company", companyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanyData(response.data);
      showNotification("Şirket bilgileri başarıyla güncellendi.", "success");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Şirket bilgileri güncellenemedi.";
      showNotification(errorMsg, "error");
    } finally {
      setCompanyUpdateLoading(false);
    }
  };

  // Şifre değiştirme submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showNotification("Yeni şifreler eşleşmiyor.", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showNotification("Yeni şifre en az 6 karakter olmalıdır.", "error");
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showNotification(
        response.message || "Şifre başarıyla değiştirildi.",
        "success"
      );
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Şifre değiştirilemedi.";
      showNotification(errorMsg, "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Kurumsal Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            color: "#1a1a1a",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <BusinessIcon sx={{ fontSize: 48, mb: 2, color: "#1a1a1a" }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
            }}
          >
            Kurumsal Profil Yönetimi
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#333333",
              fontWeight: 400,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Şirket yöneticisi profil ayarlarınızı buradan yönetebilirsiniz
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Sol Panel - Profil Özeti */}
        <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
          <Card
            sx={{
              height: "fit-content",
              //background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              border: "2px solid #FFD700",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <PersonIcon
                  sx={{
                    fontSize: 64,
                    color: "#FFD700",
                    mb: 2,
                    p: 1,
                    //backgroundColor: "#1a1a1a",
                    borderRadius: "50%",
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {profileData.name || "Kurumsal Kullanıcı"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666666", mb: 2 }}>
                  {profileData.email}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#FFD700",
                    color: "#1a1a1a",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    display: "inline-block",
                    fontWeight: 600,
                  }}
                >
                  Kurumsal Yönetici
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ color: "#666666", mb: 1 }}>
                  Hesap Durumu
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#28a745",
                    color: "white",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    display: "inline-block",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Aktif
                </Box>
              </Box>

              {/* Şirket Bilgileri */}
              <Box
                sx={{
                  mt: 3,
                  pt: 3,
                  borderTop: "1px solid rgba(224, 224, 224, 0.27)",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#666666", mb: 2, fontWeight: 600 }}
                >
                  Şirket Bilgileri
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#999999", display: "block" }}
                  >
                    Şirket Adı
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {companyData.name || "Belirtilmemiş"}
                  </Typography>
                </Box>
                {companyData.phone && (
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#999999", display: "block" }}
                    >
                      Telefon
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {companyData.phone}
                    </Typography>
                  </Box>
                )}
                {companyData.website && (
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#999999", display: "block" }}
                    >
                      Website
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {companyData.website}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#999999", display: "block" }}
                  >
                    Limitler
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {companyData.userLimit} Kullanıcı • {companyData.cardLimit}{" "}
                    Kartvizit
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ Panel - Profil Ayarları */}
        <Grid item size={{ xs: 12, sm: 12, md: 8 }}>
          <Paper
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background: "background.paper",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Sekmeler */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="Kurumsal profil ayarları sekmeleri"
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    minHeight: 48,
                    color: "text.secondary",
                    "&.Mui-selected": {
                      color: "#FFD700",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    height: 3,
                    backgroundColor: "#FFD700",
                  },
                }}
              >
                <Tab
                  label="Kurumsal Bilgiler"
                  icon={<BusinessIcon />}
                  iconPosition="start"
                  id="corporate-profile-tab-0"
                  aria-controls="corporate-profile-tabpanel-0"
                />
                <Tab
                  label="Şirket Bilgileri"
                  icon={<BusinessIcon />}
                  iconPosition="start"
                  id="corporate-profile-tab-1"
                  aria-controls="corporate-profile-tabpanel-1"
                />
                <Tab
                  label="Güvenlik Ayarları"
                  icon={<SecurityIcon />}
                  iconPosition="start"
                  id="corporate-profile-tab-2"
                  aria-controls="corporate-profile-tabpanel-2"
                />
              </Tabs>
            </Box>

            {/* Kurumsal Bilgiler Formu (Sekme 0) */}
            <Box
              role="tabpanel"
              hidden={tabIndex !== 0}
              id="corporate-profile-tabpanel-0"
              aria-labelledby="corporate-profile-tab-0"
            >
              {tabIndex === 0 && (
                <Box
                  component="form"
                  onSubmit={handleProfileSubmit}
                  sx={{ mt: 1 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="name"
                        label="Yönetici Adı Soyadı"
                        name="name"
                        value={profileData.name}
                        onChange={onProfileChange}
                        disabled={updateLoading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFD700",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFD700",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Kurumsal E-posta Adresi"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={onProfileChange}
                        disabled={updateLoading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFD700",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFD700",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 4,
                      mb: 2,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                      backgroundColor: "#FFD700",
                      color: "#1a1a1a",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        backgroundColor: "#FFA500",
                        boxShadow: "0 6px 8px -1px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Kurumsal Bilgileri Kaydet"
                    )}
                  </Button>
                </Box>
              )}
            </Box>

            {/* Şirket Bilgileri Formu (Sekme 1) */}
            <Box
              role="tabpanel"
              hidden={tabIndex !== 1}
              id="corporate-profile-tabpanel-1"
              aria-labelledby="corporate-profile-tab-1"
            >
              {tabIndex === 1 && (
                <Box
                  component="form"
                  onSubmit={handleCompanySubmit}
                  sx={{ mt: 1 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="companyName"
                        label="Şirket Adı"
                        name="name"
                        value={companyData.name}
                        onChange={onCompanyChange}
                        disabled={companyUpdateLoading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFD700",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFD700",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="companyPhone"
                        label="Telefon"
                        name="phone"
                        value={companyData.phone}
                        onChange={onCompanyChange}
                        disabled={companyUpdateLoading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFD700",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFD700",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="companyWebsite"
                        label="Website"
                        name="website"
                        value={companyData.website}
                        onChange={onCompanyChange}
                        disabled={companyUpdateLoading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFD700",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFD700",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        id="companyAddress"
                        label="Adres"
                        name="address"
                        value={companyData.address}
                        onChange={onCompanyChange}
                        disabled={companyUpdateLoading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFD700",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFD700",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 4,
                      mb: 2,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                      backgroundColor: "#FFD700",
                      color: "#1a1a1a",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        backgroundColor: "#FFA500",
                        boxShadow: "0 6px 8px -1px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                    disabled={companyUpdateLoading}
                  >
                    {companyUpdateLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Şirket Bilgilerini Kaydet"
                    )}
                  </Button>
                </Box>
              )}
            </Box>

            {/* Güvenlik Ayarları Formu (Sekme 2) */}
            <Box
              role="tabpanel"
              hidden={tabIndex !== 2}
              id="corporate-profile-tabpanel-2"
              aria-labelledby="corporate-profile-tab-2"
            >
              {tabIndex === 2 && (
                <Box
                  component="form"
                  onSubmit={handlePasswordSubmit}
                  sx={{ mt: 1 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="currentPassword"
                        label="Mevcut Şifre"
                        type="password"
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={onPasswordChange}
                        disabled={passwordLoading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFD700",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFD700",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="newPassword"
                        label="Yeni Şifre"
                        type="password"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={onPasswordChange}
                        disabled={passwordLoading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFD700",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFD700",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="confirmNewPassword"
                        label="Yeni Şifre (Tekrar)"
                        type="password"
                        id="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={onPasswordChange}
                        disabled={passwordLoading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFD700",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFD700",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 4,
                      mb: 2,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                      backgroundColor: "#FFD700",
                      color: "#1a1a1a",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        backgroundColor: "#FFA500",
                        boxShadow: "0 6px 8px -1px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Şifreyi Güncelle"
                    )}
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CorporateProfilePage;
