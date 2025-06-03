import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Chip,
  Stack,
  Avatar,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

const rolesList = ["USER", "ADMIN", "PHARMACIST"];

const initialForm = {
  firstName: "",
  lastName: "",
  address: "",
  age: "",
  email: "",
  password: "",
  phoneNumber: "",
  roles: [] as string[],
};

const nameRegex = /^[\p{L} '-]+$/u;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,100}$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "firstName" || name === "lastName") {
      if (!value.trim()) {
        error = `${name === "firstName" ? "First" : "Last"} name is required`;
      } else if (value.length > 50) {
        error = `${name === "firstName" ? "First" : "Last"} name must not exceed 50 characters`;
      } else if (!nameRegex.test(value)) {
        error = `${name === "firstName" ? "First" : "Last"} name can only contain letters, spaces, hyphens, and apostrophes`;
      }
    }

    if (name === "address") {
      if (!value.trim()) {
        error = "Address is required";
      } else if (value.length > 255) {
        error = "Address must not exceed 255 characters";
      }
    }

    if (name === "age") {
      if (value === "") {
        error = "Age is required";
      } else {
        const ageNum = Number(value);
        if (isNaN(ageNum) || ageNum < 0) {
          error = "Age must be non-negative";
        } else if (ageNum > 150) {
          error = "Age must be realistic";
        }
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        error = "Email should be valid";
      }
    }

    if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 8 || value.length > 100) {
        error = "Password must be between 8 and 100 characters";
      } else if (!passwordRegex.test(value)) {
        error = "Password must contain uppercase, lowercase, number, and special character";
      }
    }

    if (name === "phoneNumber") {
      if (!value.trim()) {
        error = "Phone is required";
      } else if (!phoneRegex.test(value)) {
        error = "Phone must be 7-15 digits, may start with +, and contain only numbers";
      }
    }

    return error;
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    newErrors.firstName = validateField("firstName", form.firstName);
    newErrors.lastName = validateField("lastName", form.lastName);
    newErrors.address = validateField("address", form.address);
    newErrors.age = validateField("age", form.age);
    newErrors.email = validateField("email", form.email);
    newErrors.password = validateField("password", form.password);
    newErrors.phoneNumber = validateField("phoneNumber", form.phoneNumber);

    if (!form.roles || form.roles.length === 0) {
      newErrors.roles = "User must have at least one role";
    }

    // Remove empty errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleRoleToggle = (role: string) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [role],
    }));
    setErrors((prev) => ({
      ...prev,
      roles: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Submit logic here
      alert("Registration successful!");
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
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 5,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Stack alignItems="center" spacing={2} mb={2}>
            <Avatar sx={{ bgcolor: "#1976d2", width: 64, height: 64 }}>
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={700} color="#1976d2">
              Register
            </Typography>
            <Typography color="text.secondary" align="center">
              Create your account to access the pharmacy system
            </Typography>
          </Stack>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  fullWidth
                  variant="outlined"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  inputProps={{ maxLength: 50 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  fullWidth
                  variant="outlined"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  inputProps={{ maxLength: 50 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TextField
                label="Address"
                name="address"
                fullWidth
                variant="outlined"
                value={form.address}
                onChange={handleChange}
                required
                error={!!errors.address}
                helperText={errors.address}
                inputProps={{ maxLength: 255 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Age"
                  name="age"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={form.age}
                  onChange={handleChange}
                  error={!!errors.age}
                  helperText={errors.age}
                  inputProps={{ min: 0, max: 150 }}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CakeIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  fullWidth
                  variant="outlined"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  inputProps={{ maxLength: 15 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

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
                inputProps={{ maxLength: 100 }}
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
                inputProps={{ minLength: 8, maxLength: 100 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Role
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {rolesList.map((role) => (
                    <Chip
                      key={role}
                      label={role}
                      color={form.roles[0] === role ? "primary" : "default"}
                      variant={form.roles[0] === role ? "filled" : "outlined"}
                      onClick={() => handleRoleToggle(role)}
                      clickable
                      sx={{
                        fontWeight: 500,
                        fontSize: 16,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        transition: "all 0.2s",
                        boxShadow:
                          form.roles[0] === role
                            ? "0 2px 8px rgba(25, 118, 210, 0.15)"
                            : "none",
                        "&:hover": {
                          backgroundColor: "#e3f2fd",
                        },
                      }}
                    />
                  ))}
                </Box>
                {errors.roles && (
                  <Typography color="error" variant="caption">
                    {errors.roles}
                  </Typography>
                )}
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
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
                Register
              </Button>
              <Typography align="center" sx={{ mt: 1 }}>
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  color="primary"
                  fontWeight={600}
                >
                  Login
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}