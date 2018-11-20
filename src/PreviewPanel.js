import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PreviewTabs from "./PreviewTabs";

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
  render() {
    const {
      classes,
      query,
      handleTablePreview,
      handleScopePreview
    } = this.props;
    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            onClick={handleScopePreview}
            expandIcon={<ExpandMoreIcon />}
          >
            <Button className={classes.heading}>Preview</Button>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <PreviewTabs
              handleTablePreview={handleTablePreview}
              handleScopePreview={handleScopePreview}
              squelQuery={query}
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
