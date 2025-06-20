import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Avatar,
  InputAdornment,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import { authService } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
        error = "Email should be valid";
    }
    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 8) error = "Password must be at least 8 characters";
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    newErrors.email = validateField("email", form.email);
    newErrors.password = validateField("password", form.password);
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    setApiError("");
    
    try {
      await authService.login(form);
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 5,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Stack alignItems="center" spacing={2} mb={2}>
            <Avatar sx={{ bgcolor: "#1976d2", width: 64, height: 64 }}>
              <LockOutlinedIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={700} color="#1976d2">
              Login
            </Typography>
            <Typography color="text.secondary" align="center">
              Sign in to your pharmacy account
            </Typography>
          </Stack>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                variant="outlined"
                value={form.email}
                onChange={handleChange}
                required
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                variant="outlined"
                value={form.password}
                onChange={handleChange}
                required
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: 18,
                  background:
                    "linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)",
                  boxShadow: "0 4px 20px 0 rgba(25, 118, 210, 0.15)",
                  transition: "background 0.3s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)",
                  },
                }}
              >
                {submitting ? "Signing in..." : "Login"}
              </Button>
              <Typography align="center" sx={{ mt: 1 }}>
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  underline="hover"
                  color="primary"
                  fontWeight={600}
                >
                  Sign up
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
