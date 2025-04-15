import Sidebar from "../components/Sidebar"
import AccountProfile from "./AccountProfile"
import { Box } from "@mui/material"

const Account = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          p: 4,
          pt: 2,
          ml: "375px", // Offset for the sidebar width
          width: { xs: "100%", md: "calc(100% - 375px)" }, // Responsive width calculation
          bgcolor: "#f8f9fa", // Light background color
          position: "relative", // Ensure proper stacking context
        }}
      >
        <AccountProfile />
      </Box>
    </Box>
  )
}

export default Account
