import { Tab, Tabs, tabsClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PillTabs = styled(Tabs)(({ theme }) => ({
  alignSelf: "center",
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : "rgba(195, 195, 195, 0.06)",
  borderRadius: 10,
  padding: 4,
  minHeight: 48,
  [`& .${tabsClasses.flexContainer}`]: { gap: 0 },
  [`& .${tabsClasses.indicator}`]: { display: "none" },
}));

export const PillTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  minHeight: 20,
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  borderRadius: 10,
  color: theme.palette.text.secondary,
  fontWeight: 500,
  "&:not(.Mui-selected):hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.grey[200]
        : "rgba(82, 80, 80, 0.08)",
  },
  "&.Mui-selected": {
    backgroundColor: "#fff",
    color: theme.palette.text.primary,
    boxShadow: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.10)",
    fontWeight: 400,
  },
}));
