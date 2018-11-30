import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Table from "./Table";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { formatNames } from "./MakeQuery";
import teal from "@material-ui/core/colors/teal";

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
    backgroundColor: theme.palette.background.paper,
    textAlign: "left",
    height: "100%",
    maxHeight: "100%"
  },
  final: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: "#b5e4e4",
    textAlign: "left",
    height: "100%",
    maxHeight: "100%"
  },
  monospace: {
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace"
  },
  paperPreview: {
    height: 350,
    width: "100%",
    margin: 0,
    padding: theme.spacing.unit * 3
  },
  paperFinal: {
    height: 400,
    width: theme.spacing.unit * 110,
    padding: theme.spacing.unit * 3
  },
  paperTablePreview: {
    height: 250,
    width: "auto%",
    //marginTop: theme.spacing.unit * 3,
    overflow: "auto"
  },
  paperTableFinal: {
    height: 350,
    width: "auto%",
    //marginTop: theme.spacing.unit * 3,
    overflow: "auto"
  }
});

class PreviewTabs extends React.Component {
  state = {
    selectedTab: 0,
    selectedModelsAndFields: [],
    qualifiedFields: [],
    where: "",
    order: [],
    data: []
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
    let { data, numFields, numRows, sqlQuery, preview, classes } = this.props;

    if (!sqlQuery) {
      sqlQuery = electron.remote.getGlobal("sharedObj").sqlQuery;
      console.log("sqlQery", sqlQuery);
    }
    console.log("*****props.props****", this.props);
    const { selectedTab } = this.state;
    return (
      <Paper elevation={0} className={preview ? classes.root : classes.final}>
        <Tabs
          value={this.state.selectedTab}
          indicatorColor="secondary"
          textColor="secondary"
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
            {preview ? (
              <Paper
                className={preview ? classes.paperPreview : classes.paperFinal}
              >
                {this.props.preview && (
                  <Typography variant="caption">
                    This is a preview - only up to the first 10 rows of your
                    current request are shown. <br />
                    Submit your request to receive the complete result.
                  </Typography>
                )}
                {/* <Typography component="div"> */}
                {/* <Paper
                className={
                  preview ? classes.paperTablePreview : classes.paperTableFinal
                }
              > */}
                {sqlQuery && data.length > 0 ? (
                  <Table data={data} preview={preview} className="table" />
                ) : sqlQuery ? (
                  "Loading..."
                ) : (
                  "There was no query submitted"
                )}
                {/* </Paper> */}
                {/* </Typography> */}
              </Paper>
            ) : (
              <Paper className={classes.paperFinal}>
                {sqlQuery && data.length > 0 ? (
                  <Table data={data} preview={preview} className="table" />
                ) : sqlQuery ? (
                  "Loading..."
                ) : (
                  "There was no query submitted"
                )}
              </Paper>
            )}
          </TabContainer>
        )}
        {selectedTab === 1 && (
          <TabContainer>
            <Paper
              className={preview ? classes.paperPreview : classes.paperFinal}
            >
              {preview && (
                <Typography variant="caption" style={{ marginBottom: 15 }}>
                  Your current request will result in this many rows and
                  columns:
                </Typography>
              )}
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
                  {this.state.qualifiedFields.filter(field =>
                    field.includes("(")
                  ).length > 0 ? (
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
            </Paper>
          </TabContainer>
        )}
        {selectedTab === 2 && (
          <TabContainer>
            <Paper
              className={preview ? classes.paperPreview : classes.paperFinal}
            >
              {sqlQuery ? (
                <div>
                  <Typography variant="caption" style={{ marginBottom: 15 }}>
                    For your reference you can find the SQL query used to
                    produce the current preview data or results below.
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
            </Paper>
          </TabContainer>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(PreviewTabs);
