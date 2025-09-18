import { Outlet, Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useAuthStore } from "../../modules/auth/store/auth.store";

export default function Layout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>Gestión de Envíos</Typography>
          <Button
            color="inherit"
            onClick={() => {
              logout();
              useAuthStore.persist.clearStorage();
              useAuthStore.setState({ token: null, user: null });
              navigate("/auth", { replace: true });
            }}
          >
            Salir
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
