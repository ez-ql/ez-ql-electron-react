import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import amber from "@material-ui/core/colors/amber";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffe082"
    },
    secondary: {
      main: "rgb(61,85,126)"
    }
  }
});

export default theme;
