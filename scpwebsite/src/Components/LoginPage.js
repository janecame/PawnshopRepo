import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import InternetStatus from "../Functions/InternetStatus";
import { useAuth } from "../contexts/AuthContext";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();
  const netStatus = InternetStatus();
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ username, password }) => login(username, password),
    onSuccess: (result) => {
      if (result === "ok") {
        navigate("/dashboard", { replace: true });
        return;
      }
      if (result === "noUser") {
        setAlert({ severity: "warning", text: "User does not exist" });
        return;
      }
      if (result === "badPassword") {
        setAlert({ severity: "error", text: "Incorrect Password" });
        return;
      }
      setAlert({ severity: "error", text: "Login failed. Please try again." });
    },
    onError: () => {
      setAlert({ severity: "error", text: "Login failed. Please try again." });
    },
  });

  const onSubmit = (data) => {
    if (netStatus === false) {
      setAlert({ severity: "error", text: "No Internet Connection" });
      return;
    }
    setAlert(null);
    mutate(data);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 800,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Branding panel — hidden on mobile */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 5,
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          <Box
            component="img"
            src="../Imgs/pawnshop.png"
            alt="Logo"
            sx={{ height: 160, mb: 3 }}
          />
          <Typography variant="h5" fontWeight={600} textAlign="center">
            Pawnshop Management System
          </Typography>
        </Box>

        {/* Form panel */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            gap: 2,
          }}
        >
          <Box
            component="img"
            src="../Imgs/user.png"
            alt="User avatar"
            sx={{ width: 80, height: 80, borderRadius: "50%", boxShadow: 2 }}
          />

          <Typography variant="subtitle1" color="text.secondary">
            Login to your account
          </Typography>

          {alert && (
            <Alert
              severity={alert.severity}
              onClose={() => setAlert(null)}
              sx={{ width: "100%" }}
            >
              {alert.text}
            </Alert>
          )}

          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Username"
                error={!!errors.username}
                helperText={errors.username?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isPending}
            startIcon={
              isPending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <LoginIcon />
              )
            }
          >
            {isPending ? "Please wait..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}