import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import amber from "@material-ui/core/colors/amber";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffe082"
    },
    secondary: {
      main: "rgb(35, 35, 96)"
    }
  }
});

// drawer + flkty:  rgb(174, 222, 247);
// background: rgb(216, 249, 253)

export default theme;
