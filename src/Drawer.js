import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import withResetGlobal from "./ResetGlobalHOC";
import teal from "@material-ui/core/colors/teal";

import cyan from "@material-ui/core/colors/cyan";

import IconButton from "@material-ui/core/IconButton";
// import AppBar from './AppBar'

const electron = window.require("electron");

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex",
    backgroundColor: "rgb(174,222,274)"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  grow: {
    flexGrow: 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "rgb(174,222,274)"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  list: {
    marginTop: "4rem",
    width: 350,
    height: "100vh",
    backgroundColor: "rgb(174,222,274)"
  },
  toolbar: theme.mixins.toolbar,
  itemtext: {
    color: "#00838F"
  }
});

class PermanentDrawerLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: {},
      databases: [],
      projects: []
    };
  }

  componentDidMount() {
    const user = electron.remote.getGlobal("sharedObj").user;
    const databases = electron.remote.getGlobal("sharedObj").databases;
    const projects = electron.remote.getGlobal("sharedObj").projects;
    const allQueries = electron.remote.getGlobal("sharedObj").queries;
    // const databaseProjects = projects.map(project => {
    //   const queries = allQueries.filter(query => {
    //     if (query.project_id === project.project_id) {
    //       return query
    //     }
    //   })
    //   return { ...project, queries, databaseProjects }
    // })

    this.setState({ user, databases, projects });
  }

  render() {
    console.log("state!!!!!!!", this.state);
    const { classes } = this.props;
    const HomeButton = props => {
      return (
        <Button color="inherit" component={Link} to="/homepage">
          Home
        </Button>
      );
    };
    const HomeButtonWithReset = withResetGlobal(HomeButton);
    const sideList = (
      <div className={classes.list}>
        {/* <List>
          <ListItem key={"Database"} color="inherit">
            <ListItemText primary="Your Projects" />
          </ListItem>
        </List> */}
        {this.state.databases[0] &&
          this.state.databases.map(database => {
            return (
              <div className="Margin-top-5">
                <List>
                  <ListItem key={"Database"} color="inherit">
                    <ListItemText
                      primary={database.database_name.toUpperCase()}
                    />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  {this.state.projects[0] &&
                    this.state.projects.map(project => {
                      if (database.database_id === project.database_id) {
                        return (
                          <ListItem
                            button
                            key={`${project.project_name}`}
                            component={Link}
                            to={`/project/${project.project_id}`}
                          >
                            <ListItemText primary={`${project.project_name}`} />
                          </ListItem>
                        );
                      }
                    })}
                </List>
              </div>
            );
          })}
      </div>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar className="Navy">
            <Typography variant="h6" color="inherit" className={classes.grow}>
              ez*ql
            </Typography>
            <HomeButtonWithReset />
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {sideList}
          {/* <div className={classes.toolbar} />
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
          {/* <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
        </Drawer>
      </div>
    );
  }
}

PermanentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PermanentDrawerLeft);
