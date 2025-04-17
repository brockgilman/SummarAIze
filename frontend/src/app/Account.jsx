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
          px: 4,
          pt: 4,
          maxWidth: "800px", // Sets a maximum width for the profile box
          width: "100%",
          ml: "-140px", // Shifts box to the left closer to sidebar
          bgcolor: "#fff",
        }}
      >
        <AccountProfile />
      </Box>
    </Box>
  )
}

export default Account
