import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from "../assets/images/logo.png";
import Web3 from "web3";

const DrawerAppBar = (props) => {
  const [account, setAccount] = React.useState();
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  const web3 = new Web3(Web3.givenProvider);
  const { ethereum } = window;

  React.useEffect(() => {
    async function load() {
      if (!ethereum) {
        alert("Please Install MetaMask");
        window.location.reload();
      } else {
        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts[0]);
      }
    }
    load();
  }, []);

  React.useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 770); // Adjust the breakpoint as needed
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openInNewTab = (url) => {
    window.open(url, "_self");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={Logo} alt="Logo" style={{ height: "50px" }} />
          </Typography>
          {isSmallScreen ? (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" component="div">
                {account}
              </Typography>
              <Button
                color="inherit"
                onClick={() =>
                  openInNewTab(
                    "https://bscscan.com/address/0x57949388158dd8d2a790dbfc51cdf3caa265b64d/"
                  )
                }
              >
                CBC
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                {account}
              </Typography>
              <Button
                color="inherit"
                onClick={() =>
                  openInNewTab(
                    "https://bscscan.com/address/0x57949388158dd8d2a790dbfc51cdf3caa265b64d/"
                  )
                }
              >
                CBC
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
