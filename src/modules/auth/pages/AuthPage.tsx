import { Box, Paper } from "@mui/material";
import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import { PillTab, PillTabs } from "../../../shared/ui/PillTabs";
import video from "../../../assets/video.mp4";
import VideoPlayer from "../components/VideoPlayer";

export default function AuthPage() {
  const [tab, setTab] = useState<number>(0);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Columna izquierda: formulario */}
      <Paper
        sx={{
          flex: 1,
          p: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border: "none",
          boxShadow: "none",
        }}
      >
        <PillTabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <PillTab label="Iniciar" />
          <PillTab label="Registrar" />
        </PillTabs>

        {tab === 0 ? <LoginForm /> : <RegisterForm />}
      </Paper>
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" }, // oculto en mobile si quieres
          alignItems: "center",
          justifyContent: "center",
          p: { md: 0 },
        }}
      >
        {/* <Box
          component="img"
          src={safeImg}
          alt="Ilustración de seguridad"
          sx={{
            width: "100%",
            height: "100vh",
            objectFit: "contain",
            borderRadius: 2,
          }}
        /> */}

        <VideoPlayer src={video} poster="/images/poster.jpg" />
      </Box>
    </Box>
  );
}
