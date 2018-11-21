import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PreviewTabs from "./PreviewTabs";
import squel from "squel";
const electron = window.require("electron");
const sharedObj = electron.remote.getGlobal("sharedObj");
const ipcRenderer = electron.ipcRenderer;

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
  //PreviewPanel receives props from MakeQuery
  //this section might have to be moved up into the parent component
  constructor(props) {
    super(props);
    this.state = {
      previewData: [],
      fields: 0,
      rows: 0,
      sql: ""
      // expanded: null
    };
  }

  componentDidMount() {
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({
        previewData: arg.slice(0, 10),
        fields: Object.keys(arg[0]).length,
        rows: arg.length
      });
    });
    ipcRenderer.on("async-new-table-preview-query", (event, arg) => {
      this.setState({
        previewData: arg.slice(0, 10),
        fields: Object.keys(arg[0]).length,
        rows: arg.length
      });
    });
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  //this section might have to be moved up into the parent component
  // collapsePanel = event => {
  //   if (this.props.expanded) this.setState({ expanded: false });
  //   else {
  //     this.setState({ expanded: true });
  //     this.loadPreview();
  //   }
  // };

  loadPreview = () => {
    //build squel query based on currQuer in global obj
    //will include any aggregates if there are any
    const basicQuery = squel
      .select()
      .from(sharedObj.currQuery.from)
      .fields(sharedObj.currQuery.fields);

    //TODO add join logic
    // if (sharedObj.joinType) {
    //   switch (
    //     sharedObj.joinType
    //     // case left_join:
    //   basicQuery.left_join;
    //   break;
    // case right_join:
    //   break;
    // case inner_join:
    //   break;
    // case outer_join:
    //   break;
    //   ) {
    //   }
    // }

    //TODO add filter logic
    this.setState({ sql: basicQuery.toString() });
    ipcRenderer.send("async-new-table-preview-query", basicQuery.toString());
  };

  render() {
    const { classes } = this.props;
    // const { expanded } = this.state;
    return (
      <div className={classes.root}>
        <ExpansionPanel
        // expanded={expanded === "panel1"}
        // onClick={this.state.expanded && this.props.getPreview}
        >
          {/* collapse only when overall change detected*/}
          <ExpansionPanelSummary
            // onClick={handleScopePreview}
            expandIcon={<ExpandMoreIcon />}
          >
            <Button className={classes.heading}>Preview</Button>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <PreviewTabs
              // handleTablePreview={handleTablePreview}
              //handleScopePreview={handleScopePreview}
              squelQuery={this.state.sql}
            />
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

//    if (this.state.expanded)
// let query = squel
// .select()
// .from(this.state.from)
// .fields(this.state.fields)
// .toString();
// ipcRenderer.send("async-new-table-preview-query", query);
