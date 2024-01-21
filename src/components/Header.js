import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Logo from "../assets/images/logo.png";
import Web3 from "web3";

const drawerWidth = 240;

function DrawerAppBar(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [account, setAccount] = React.useState();

  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const copyToClipBoard = async (address) => {
    try {
      console.log("address", address);
      await navigator.clipboard.writeText(address);
      setCopySuccess("Copied!");
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <img className="logo-img" src={Logo} alt="ICOlogo" />
      </Typography>
      <Divider />
      <List>
        <ListItemButton sx={{ textAlign: "center" }}>
          <ListItemText
            className="account_mob_"
            onClick={() => copyToClipBoard(account)}
            primary={account}
          />
        </ListItemButton>
      </List>

      <List>
        <a onClick={() => openInNewTab("https://bscscan.com/address/0x57949388158dd8d2a790dbfc51cdf3caa265b64d")}>
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="CBC" />
            </ListItemButton>
          </ListItem>
        </a>
      </List>
    </Box>
  );

  const web3 = new Web3(Web3.givenProvider);
  const { ethereum } = window;

  if (!ethereum) {
    alert("Please Install MetaMask");
    window.location.reload();
  }

  React.useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    }
    load();
  }, []);

  const openInNewTab = (url) => {
    window.open(url, "_self");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <img className="logo-img" src={Logo} alt="ICOlogo" />
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button
              sx={{ color: "#23def3" }}
              onClick={() => copyToClipBoard(account)}
            >
              {account}
            </Button>
            <Button
              onClick={() => openInNewTab("https://bscscan.com/address/0x57949388158dd8d2a790dbfc51cdf3caa265b64d/")}
              sx={{
                border: "2px #23def3 solid",
                color: "#23def3 !important",
                borderRadius: "20px;",
              }}
            >
              CBC
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
