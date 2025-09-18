import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { authRegister } from "../services/authService";
import SocialDecor from "../../../shared/ui/SocialDecore";

import { parseJoiErrors } from "../../../shared/api/errros";
import { isAxiosError } from "axios";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

type FieldErrs = Partial<Record<keyof RegisterFormData | "general", string>>;

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrs>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    // Limpia el error del campo que se está editando
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setFieldErrors({});
    setLoading(true);
    try {
      await authRegister(form);
      setOk(true);
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const payload = error.response?.data;

        if (status === 422) {
          const fe = parseJoiErrors(payload);
          setFieldErrors(fe as FieldErrs);

          // si hay errores por campo, NO muestres popup
          const hasFieldErrs = Object.keys(fe).some((k) => k !== "general");
          setErr(hasFieldErrs ? null : (fe.general ?? "Datos inválidos."));
          return;
        }

        // otros estados (401/500, etc.) -> sí popup
        setErr(String(payload?.message ?? "No se pudo registrar."));
      } else {
        setErr("No se pudo registrar. Verifica tu conexión.");
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
      noValidate
    >
      <Typography sx={{ textAlign: "center", mb: "1rem" }} variant="h5">
        Crea tu cuenta
      </Typography>

      <Box sx={{ height: 8 }} />

      <TextField
        label="Nombre"
        name="name"
        size="small"
        value={form.name}
        onChange={handleChange}
        error={!!fieldErrors.name}
        helperText={fieldErrors.name}
        FormHelperTextProps={{ sx: { fontSize: 12 } }}
        InputLabelProps={{ required: false }}
      />

      <TextField
        label="Email"
        type="email"
        name="email"
        size="small"
        value={form.email}
        onChange={handleChange}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
        FormHelperTextProps={{ sx: { fontSize: 12 } }}
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
        FormHelperTextProps={{ sx: { fontSize: 12 } }}
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
      <SocialDecor label="Registras con" />
      <Box sx={{ height: 5 }} />

      <Button
        sx={{ p: 1, textTransform: "none", fontWeight: "300" }}
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
      >
        {loading ? "Creando..." : "Registrarse"}
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

      <Snackbar open={ok} autoHideDuration={2200} onClose={() => setOk(false)}>
        <Alert severity="success" variant="filled" onClose={() => setOk(false)}>
          Cuenta creada. Ya puedes iniciar sesión.
        </Alert>
      </Snackbar>
    </Stack>
  );
}
