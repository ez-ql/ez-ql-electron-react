import Button from "@material-ui/core/Button";
import React from "react";
import { Link } from "react-router-dom";
import withResetGlobal from "./ResetGlobalHOC";

const StartOverButton = props => {
  return (
    <Button
      variant="contained"
      className="Button"
      component={Link}
      to="/startQuery"
    >
      START OVER
    </Button>
  );
};

export default withResetGlobal(StartOverButton);

// import Button from "@material-ui/core/Button";
// import React from "react";
// import { Link } from "react-router-dom";
// const electron = window.require("electron");

// const initialCurrQuery = {
//   from: "",
//   fields: [],
//   where: "",
//   qualifiedFields: [],
//   joinType: "",
//   leftRef: "",
//   rightRef: "",
//   group: "",
//   order: [],
//   selectedModelsAndFields: [],
//   selectedModel: {}
// };

// const StartOverButton = () => {
//   return (
//     <Button
//       variant="contained"
//       className="Button"
//       onClick={() => {
//         electron.remote.getGlobal("sharedObj").currQuery = initialCurrQuery;
//         electron.remote.getGlobal("sharedObj").sqlQuery = "";
//       }}
//       component={Link}
//       to="/startQuery"
//     >
//       START OVER
//     </Button>
//   );
// };

// export default StartOverButton;
