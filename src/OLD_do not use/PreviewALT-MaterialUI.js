import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import Table from "../Table.js";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const styles = theme => ({
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto",
    [theme.breakpoints.up("sm")]: {
      marginRight: -8
    }
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
});

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedData: [],
      queryString: this.props.squelQuery || "", //unclear where exactly this will be passed down
      sqlPreview: false,
      tablePreview: false
    };
    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({ selectedData: arg });
    });
  }

  //potential efficiency issue:
  //in order to display the number of rows and columns I understand
  //that we'll have to query the database, the option to toggle the
  //preview and/or only show the first 10 rows therefore becomes a pure UX feature with the goal not to overwhelm the user

  handleExpandClick(e) {
    const eTarget = e.target.name;
    const currentValue = this.state[eTarget];
    this.setState({ [eTarget]: !currentValue });
  }

  render() {
    const { classes } = this.props;
    const numOfInstances = this.state.selectedData.length;
    const numOfFields = this.props.numOfFields;

    return (
      <div className="preview flex-row">
        <div>
          <div className="volume">
            <div>Instances (rows): {numOfInstances}</div>
            <div>Fields (columns): {numOfFields}</div>
          </div>
          <div
            className="togglePreview"
            name="tablePreview"
            onClick={this.handleExpandClick}
          >
            <Typography
              name="tablePreview"
              variant="overline"
              align="right"
              className={classNames({
                expanded: this.state.tablePreview
              })}
              aria-expanded={this.state.tablePreview}
              aria-label="Show more"
            >
              Preview data
              <IconButton name="tablePreview">
                <ExpandMoreIcon
                  name="tablePreview"
                  className={classNames({
                    expandOpen: this.state.tablePreview
                  })}
                />
              </IconButton>
            </Typography>
          </div>
          <Collapse
            name="tablePreview"
            in={this.state.tablePreview}
            timeout="auto"
            unmountOnExit
          >
            <Table limit={10} selectedData={this.state.selectedData} />
          </Collapse>
          <Typography
            name="sqlPreview"
            variant="overline"
            align="right"
            className={classNames(classes.expand)}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.sqlPreview}
            aria-label="Show more"
          >
            Show SQL query
            <IconButton
              name="sqlPreview"
              className={classNames({
                expandOpen: this.state.sqlPreview
              })}
            >
              <ExpandMoreIcon
                name="sqlPreview"
                className={classNames({
                  expandOpen: this.state.sqlPreview
                })}
              />
            </IconButton>
          </Typography>
          <Collapse
            name="sqlPreview"
            in={this.state.sqlPreview}
            timeout="auto"
            unmountOnExit
          >
            <Typography className="sqlPreview" variant="body1">
              {this.props.squelQuery}
            </Typography>
          </Collapse>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Preview);
