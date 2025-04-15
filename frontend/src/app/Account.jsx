import Sidebar from "../components/Sidebar"
import AccountProfile from "./AccountProfile"
import { Box } from "@mui/material"

const Account = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />    
        <AccountProfile />
    </Box>
  )
}

export default Account
