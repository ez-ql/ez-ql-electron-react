import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Table from "./Table";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    textAlign: "left"
  },
  monospace: {
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace"
  }
});

class PreviewTabs extends React.Component {
  state = {
    selectedTab: 0
  };

  handleChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  };

  render() {
    const { previewData, numFields, numRows, sqlQuery } = this.props.props;
    console.log("*****props.props****", this.props.props);
    const { classes } = this.props;
    const { selectedTab } = this.state;

    return (
      <Paper elevation={0} className={classes.root}>
        <Tabs
          value={this.state.selectedTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
        >
          <Tab label="Preview table" />
          <Tab label="Show current scope" />
          <Tab label="Show SQL query" />
        </Tabs>
        {selectedTab === 0 && (
          <TabContainer>
            <Typography variant="caption" style={{ marginBottom: 15 }}>
              This is a preview - only up to the first 10 rows of your current
              request are shown. <br />
              Please submit your request to receive the complete result.
            </Typography>{" "}
            <Typography component="div">
              {previewData.length > 0 ? (
                <Table data={previewData} className="table" />
              ) : (
                "Loading..."
              )}
            </Typography>
          </TabContainer>
        )}
        {selectedTab === 1 && (
          <TabContainer>
            <Typography variant="caption" style={{ marginBottom: 15 }}>
              Your current request will result in this many rows and columns:
            </Typography>
            {previewData.length > 0 ? (
              <Typography>
                Instances (rows): {numRows}
                <br />
                Fields (columns): {numFields}
              </Typography>
            ) : (
              "Loading..."
            )}
          </TabContainer>
        )}
        {selectedTab === 2 && (
          <TabContainer>
            {sqlQuery ? (
              <div>
                <Typography variant="caption" style={{ marginBottom: 15 }}>
                  For your reference you can find the SQL query used to produce
                  the current preview data or results below.
                </Typography>
                {previewData.length > 0 ? (
                  <Typography className={classes.monospace}>
                    {sqlQuery}
                  </Typography>
                ) : (
                  "Loading..."
                )}
              </div>
            ) : (
              <Typography>There was no query submitted.</Typography>
            )}
          </TabContainer>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(PreviewTabs);
