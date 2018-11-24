import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PreviewTabs from "./PreviewTabs";
const electron = window.require("electron");
const sharedObj = electron.remote.getGlobal("sharedObj");

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class PreviewPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewData: [],
      fields: 0,
      rows: 0,
      sqlQuery: ""
      // expanded: null
    };
  }

  componentDidMount() {
    //TODO make this the reply from the updated backend call, INCLUDE SQL query
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({
        //TODO assuming arg contains rows and sqlQuery
        previewData: arg.slice(0, 10),
        numFields: Object.keys(arg[0]).length,
        numRows: arg.length,
        sqlQuery: sharedObj.sqlQuery
      });
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners("async-query-reply");
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  render() {
    const { classes } = this.props;
    // const { expanded } = this.state;
    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Button className={classes.heading}>Preview</Button>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <PreviewTabs props={{ ...this.state }} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

PreviewPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PreviewPanel);
