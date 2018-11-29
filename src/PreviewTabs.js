import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Table from "./Table";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { formatNames } from "./MakeQuery";
import teal from '@material-ui/core/colors/teal';

const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal("sharedObj");

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
    backgroundColor: teal[200],
    textAlign: "left",
    height: "100%",
    maxHeight: "100%"
  },
  monospace: {
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace"
  }
});

class PreviewTabs extends React.Component {
  state = {
    selectedTab: 0,
    selectedModelsAndFields: [],
    qualifiedFields: [],
    where: "",
    order: []
  };

  handleChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  };

  componentDidMount() {
    const selectedModelsAndFields =
      sharedObject.currQuery.selectedModelsAndFields;
    const qualifiedFields = sharedObject.currQuery.qualifiedFields;
    const where = sharedObject.currQuery.where;
    const order = sharedObject.currQuery.order;
    console.log("currQuery", sharedObject.currQuery);
    this.setState({
      selectedModelsAndFields,
      qualifiedFields,
      where,
      order
    });
  }

  render() {
    let { data, numFields, numRows, sqlQuery } = this.props.props;

    if(!sqlQuery){
      sqlQuery = electron.remote.getGlobal("sharedObj").sqlQuery
      console.log('sqlQery', sqlQuery)
    }
    console.log("*****props.props****", this.props.props);
    const { classes } = this.props;
    const { selectedTab } = this.state;
    console.log("DATA", data);
    return (
      <Paper elevation={0} className={classes.root}>
        <Tabs
          value={this.state.selectedTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
        >
          <Tab label={this.props.preview ? "Preview table" : "Results"} />
          <Tab
            label={this.props.preview ? "Show current scope" : "Show scope"}
          />
          <Tab label="Show SQL query" />
        </Tabs>
        {selectedTab === 0 && (
          <TabContainer>
            {this.props.preview && (
              <Typography variant="caption" style={{ marginBottom: 15 }}>
                This is a preview - only up to the first 10 rows of your current
                request are shown. <br />
                Please submit your request to receive the complete result.
              </Typography>
            )}
            <Typography component="div" id="redBorder">
              {data.length > 0 ? (
                <Table
                  data={data}
                  preview={this.props.preview}
                  className="table"
                />
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
            {data.length > 0 ? (
              <div>
                <Typography>
                  Instances (rows): {numRows}
                  <br />
                  Fields (columns): {numFields}
                </Typography>
                <Typography
                  variant="caption"
                  style={{ marginBottom: 15, marginTop: 30 }}
                >
                  Selected Tables and Fields:
                </Typography>
                {this.state.selectedModelsAndFields.length > 0
                  ? this.state.selectedModelsAndFields.map(model => {
                      return (
                        <Typography>
                          {model.model_name}: {model.fields.join(", ")}
                        </Typography>
                      );
                    })
                  : "None Selected"}
                <Typography
                  variant="caption"
                  style={{ marginBottom: 15, marginTop: 30 }}
                >
                  Selected Aggregators:
                </Typography>
                {this.state.qualifiedFields.filter(field => field.includes("("))
                  .length > 0 ? (
                  <Typography>
                    {
                      this.state.qualifiedFields.filter(field =>
                        field.includes("(")
                      )[0]
                    }
                  </Typography>
                ) : (
                  "None Selected"
                )}
                <Typography
                  variant="caption"
                  style={{ marginBottom: 15, marginTop: 30 }}
                >
                  Selected Filters:
                </Typography>
                {this.state.where !== "" ? (
                  <Typography>{this.state.where}</Typography>
                ) : (
                  "None Selected"
                )}
                <Typography
                  variant="caption"
                  style={{ marginBottom: 15, marginTop: 30 }}
                >
                  Sorted By:
                </Typography>
                {this.state.order.length > 0
                  ? this.state.order.map(field => {
                      return (
                        <Typography>
                          {field.qualifiedField}{" "}
                          {field.ascending
                            ? "in ascending order"
                            : "in descending order"}
                        </Typography>
                      );
                    })
                  : "None Selected"}
              </div>
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
                {data.length > 0 ? (
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
