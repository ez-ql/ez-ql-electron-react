import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Table from "./Table";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const database = {
  id: 1,
  name: "BikeStores",
  organizationId: 1,
  models: [
    {
      id: 1,
      name: "orders",
      databaseId: 1,
      fields: [
        {
          id: 1,
          name: "order_id",
          modelId: 1
        },
        {
          id: 2,
          name: "customer_id",
          modelId: 1
        },
        {
          id: 3,
          name: "order_status",
          modelId: 1
        },
        {
          id: 4,
          name: "order_date",
          modelId: 1
        }
      ]
    },
    {
      id: 2,
      name: "stores",
      databaseId: 1,
      fields: [
        {
          id: 1,
          name: "store_id",
          modelId: 2
        },
        {
          id: 2,
          name: "store_name",
          modelId: 2
        },
        {
          id: 3,
          name: "phone",
          modelId: 2
        },
        {
          id: 4,
          name: "email",
          modelId: 2
        }
      ]
    }
  ]
};

const getData = () => {
  return database;
};

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
    backgroundColor: theme.palette.background.paper
  },
  monospace: {
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace"
  }
});

class PreviewTabs extends React.Component {
  state = {
    value: 2,
    selectedData: []
  };

  componentDidMount() {
    const data = getData();
    this.setState({ database: data });
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({ selectedData: arg });
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleClick(e) {
    console.log("**event***", e);
  }

  render() {
    const { classes, squelQuery } = this.props;
    const { value } = this.state;

    return (
      <Paper square className={classes.root}>
        <Tabs
          value={this.state.value}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
        >
          <Tab label="Preview table" />
          <Tab label="Show SQL query" />
          <Tab label="Show scope" />
        </Tabs>
        {value === 0 && (
          <TabContainer onClick={this.handleClick}>
            <Table limit="10" className="" />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer onClick={this.handleClick}>
            <Typography className={classes.monospace}>
              {squelQuery || "There was no query submitted."}
            </Typography>
          </TabContainer>
        )}
        {value === 2 && (
          <TabContainer onClick={this.handleClick}>
            <Typography>Instances (rows): </Typography>
            <Typography>Fields (columns): </Typography>
          </TabContainer>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(PreviewTabs);
