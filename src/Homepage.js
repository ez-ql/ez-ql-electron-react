import React from "react";
import Icon from "@material-ui/core/Icon";
import { withStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import cyan from "@material-ui/core/colors/cyan";
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
    margin: theme.spacing.unit * 2,
    color: cyan[800]
  },
  iconHover: {
    margin: theme.spacing.unit * 2,
    color: "primary",
    "&:hover": {
      color: "rgb(0, 72, 79)"
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

    let projectQueries = projects.map(project => {
      const queries = allQueries.filter(query => {
        if (query.project_id === project.project_id) {
          return query;
        }
      });
      return { ...project, queries };
    });
    // projectQueries = projectQueries.slice(0, 6);
    this.setState({ user, databases, projectQueries });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="Height-100-vh Title Column Center Width-80">
        <div className="Column Display  Flex-start">
          <div>
            <Link className="No-text-decoration" to="/refineQuery">
              {/* <div className="No-text-decoration Grey min-Height-8 Align-self-end  "> */}
              <div className="Min-Height Font-size-20">
                <h3 className="Margin-top-3 Black Height-40 Center">
                  CREATE A NEW QUERY
                </h3>
              </div>
              {/* </div> */}
              <div className="Display Column">
                <div className="Align-self-center">
                  <Icon
                    className={classes.iconHover}
                    color="secondary"
                    style={{ fontSize: 100 }}
                  >
                    add_circle
                  </Icon>
                </div>
              </div>
            </Link>
          </div>
          <div className="">
            <h2 className="Margin-top-10  Height-40 Center ">
              YOUR SAVED PROJECTS
            </h2>
          </div>
          {/* <div className="Project-button">
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
          {/* <div className="No-text-decoration Project-button ">
            <Link
              className="No-text-decoration Project-button "
              to="/project/2"
            >
              <h4>
                {this.state.projectQueries[0] &&
                  this.state.projectQueries[1].project_name.toUpperCase()}
              </h4>
            </Link>
          </div> */}
          <div className="Flex-Wrap Height-20 Width-60 Margin-left-10 Margin-top-1  ">
            {this.state.projectQueries[0] &&
              this.state.projectQueries.map(projectQuery => {
                return (
                  <div className="Project-button Project effect1 ">
                    <Link className="No-text-decoration Navy" to="/project/1">
                      <h3 className="Padding-3">
                        {projectQuery.project_name.toUpperCase()}
                      </h3>
                    </Link>
                  </div>
                );
              })}
          </div>
          {/* <div className="Project-button Project effect1  "  >
          <Link className="No-text-decoration Light-blue-text" to="/project/1">
            <h3>
              {
                this.state.projectQueries[0] &&
                this.state.projectQueries[0].project_name.toUpperCase()
              }
            </h3>
          </Link>
              </div>
              <div className="No-text-decoration Project effect1 Project-button ">
          <Link className="No-text-decoration Light-blue-text" to="/project/2">
            <h3>
              {
                this.state.projectQueries[0] &&
                this.state.projectQueries[1].project_name.toUpperCase()
              }
            </h3>
          </Link>
              </div> */}
        </div>
      </div>
    );
  }
}

export default withStyles(styles(theme))(Visualize);
