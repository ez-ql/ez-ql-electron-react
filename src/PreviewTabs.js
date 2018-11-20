import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Table from "./Table";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

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
    // backgroundColor: theme.palette.background.paper,
    textAlign: "left"
  },
  monospace: {
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace"
  }
});
class PreviewTabs extends React.Component {
  state = {
    selectedTab: 0,
    previewData: [],
    fields: [],
    rows: [],
    previewQuery: ""
  };

  componentDidMount() {
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({
        previewData: arg.slice(0, 10),
        fields: Object.keys(arg[0]).length,
        rows: arg.length
      });
    });
    ipcRenderer.on("async-new-scope-preview-query", (event, arg) => {
      this.setState({
        previewData: arg.slice(0, 10),
        fields: Object.keys(arg[0]).length,
        rows: arg.length
      });
    });
    ipcRenderer.on("async-new-table-preview-query", (event, arg) => {
      this.setState({
        previewData: arg,
        fields: Object.keys(arg[0]).length
      });
    });
  }

  handleChange = (event, selectedTab) => {
    console.log("***props***", this.props);
    this.setState({ selectedTab });
    selectedTab === 0
      ? this.props.handleTablePreview(10)
      : this.props.handleScopePreview();
  };

  render() {
    const { classes, squelQuery, rows, fields } = this.props;
    const { selectedTab } = this.state;

    return (
      <Paper square className={classes.root}>
        <Tabs
          value={this.state.value}
          indicatorColor="blue"
          textColor="blue"
          onChange={this.handleChange}
        >
          <Tab label="Preview table" />
          <Tab label="Show scope" /> {/* 'dimensions'? */}
          <Tab label="Show SQL query" />
        </Tabs>
        {selectedTab === 0 && (
          <TabContainer>
            <Typography>
              <Table limit="10" className="table" />
            </Typography>
          </TabContainer>
        )}
        {selectedTab === 1 && (
          <TabContainer>
            <Typography>Instances (rows): {rows}</Typography>
            <Typography>Fields (columns): {fields}</Typography>
          </TabContainer>
        )}
        {selectedTab === 2 && (
          <TabContainer>
            {squelQuery ? (
              <Typography className={classes.monospace}>
                {squelQuery}
                {this.tempQuery}
              </Typography>
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
