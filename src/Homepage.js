import React from "react";
import Icon from "@material-ui/core/Icon";
import { withStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import theme from "./colortheme.js";

// import Button from "@material-ui/core/Button";
const electron = window.require("electron");
// const ipcRenderer = electron.ipcRenderer;

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  icon: {
    margin: theme.spacing.unit * 2
  },
  iconHover: {
    margin: theme.spacing.unit * 2,
    "&:hover": {
      color: theme.palette.primary
    }
  }
});

class Visualize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      databases: [],
      projectQueries: []
    };
  }

  componentDidMount() {
    const user = electron.remote.getGlobal("sharedObj").user;
    const databases = electron.remote.getGlobal("sharedObj").databases;
    const projects = electron.remote.getGlobal("sharedObj").projects;
    const allQueries = electron.remote.getGlobal("sharedObj").queries;

    const projectQueries = projects.map(project => {
      const queries = allQueries.filter(query => {
        if (query.project_id === project.project_id) {
          return query;
        }
      });
      return { ...project, queries };
    });

    this.setState({ user, databases, projectQueries });
  }

  render() {
    const { classes } = this.props;
    console.log("STATE", this.state.projectQueries);
    return (
      <div className="Height-50 Title Column Center Width-70">
        <div className="Column Height-50">
          <div className="">
            <h2 className="Margin-top-15 Grey  Height-40 Center ">
              YOUR SAVED PROJECTS
            </h2>
          </div>
          <div className="Project-button">
            <Link
              className="No-text-decoration Project-button "
              to="/project/1"
            >
              <h4>
                {this.state.projectQueries[0] &&
                  this.state.projectQueries[0].project_name.toUpperCase()}
              </h4>
            </Link>
          </div>
          <div className="No-text-decoration Project-button ">
            <Link
              className="No-text-decoration Project-button "
              to="/project/2"
            >
              <h4>
                {this.state.projectQueries[0] &&
                  this.state.projectQueries[1].project_name.toUpperCase()}
              </h4>
            </Link>
          </div>
          <Link className="No-text-decoration" to="/refineQuery">
            <div className="Margin-top-10">
              <Icon
                className={classes.iconHover}
                color="action"
                style={{ fontSize: 60 }}
              >
                add_circle
              </Icon>
            </div>
            <div className="No-text-decoration Grey Height-50 Align-self-end  ">
              <h3 className="No-text-decoration">CREATE QUERY</h3>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

export default withStyles(styles(theme))(Visualize);
