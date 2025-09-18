import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import SocialDecor from "../../../shared/ui/SocialDecore";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authLogin } from "../services/authService";
import { isAxiosError } from "axios";
import { parseJoiErrors } from "../../../shared/api/errros";

interface LoginFormData {
  email: string;
  password: string;
}
type FieldErrs = Partial<Record<keyof LoginFormData | "general", string>>;

export default function LoginForm() {
  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrs>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setErr(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setFieldErrors({});
    setLoading(true);
    try {
      const { token, user } = await authLogin({
        email: form.email.trim(),
        password: form.password,
      });
      login(token, user);
      navigate("/");
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const payload = error.response?.data;

        if (status === 422) {
          const fe = parseJoiErrors(payload);
          setFieldErrors(fe as FieldErrs);
          const hasFieldErrs = !!(fe.email || fe.password);
          setErr(hasFieldErrs ? null : (fe.general ?? "Datos inválidos."));
          return;
        }
        setErr(String(payload?.message ?? "Credenciales inválidas"));
      } else {
        setErr("No se pudo iniciar sesión. Verifica tu conexión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      spacing={2}
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 5, width: { xs: "100%", sm: 450 }, mx: "auto" }}
    >
      <Typography sx={{ textAlign: "center" }} variant="h5">
        Bienvenido
      </Typography>
      <Box sx={{ height: 8 }} />

      <TextField
        label="Email"
        name="email"
        size="small"
        value={form.email}
        onChange={handleChange}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
        autoComplete="email"
        InputLabelProps={{ required: false }}
      />

      <TextField
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        name="password"
        size="small"
        value={form.password}
        onChange={handleChange}
        error={!!fieldErrors.password}
        helperText={fieldErrors.password}
        autoComplete="current-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label="mostrar/ocultar contraseña"
                onClick={() => setShowPassword((s) => !s)}
                size="small"
              >
                {showPassword ? (
                  <VisibilityOff sx={{ fontSize: 22 }} />
                ) : (
                  <Visibility sx={{ fontSize: 22 }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        InputLabelProps={{ required: false }}
      />

      <Box sx={{ height: 10 }} />
      <SocialDecor />
      <Box sx={{ height: 5 }} />

      <Button
        sx={{ p: 1, textTransform: "none", fontWeight: 300 }}
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Continuar"}
      </Button>

      <Snackbar
        open={!!err}
        autoHideDuration={4000}
        onClose={() => setErr(null)}
      >
        <Alert severity="error" variant="filled" onClose={() => setErr(null)}>
          {err}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
