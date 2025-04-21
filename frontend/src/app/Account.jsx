import Sidebar from "../components/Sidebar";
import AccountProfile from "./AccountProfile";
import { Box } from "@mui/material";

const Account = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar with fixed width */}
      <Box sx={{ width: 350, flexShrink: 0 }}>
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          width: "calc(100% - 350px)",
          p: 4,
          bgcolor: "#fff",
        }}
      >
        {/* Profile box with constrained max width and left shift */}
        <Box sx={{ maxWidth: 800, ml: -60 }}>
          <AccountProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default Account;
