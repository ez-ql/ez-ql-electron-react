import React from "react";
// import Selector from './Selector/Selector'
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import SimpleDialogWrapped from "./QueryDialog";
import Icon from '@material-ui/core/Icon';
import Typography from "@material-ui/core/Typography";
import blue from '@material-ui/core/colors/blue';
import { withStyles } from '@material-ui/core/styles';

import cyan from '@material-ui/core/colors/cyan';
import grey from '@material-ui/core/colors/grey';
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;
// const sharedObject = electron.remote.getGlobal('sharedObj')


const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button:{
    backgroundColor: cyan[800],
    color: grey[50]
  },
  icon: {
    margin: theme.spacing.unit * 2,
  },
  iconHover: {
    margin: theme.spacing.unit * 2,
    color: cyan[800],
    '&:hover': {
      color: "rgb(0, 72, 79)",
    },
  },
});

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: 0,
      selectedProject: [],
      open: false,
      selectedValue: "value"
    };
  }

  componentDidMount() {
    const projectId = Number(this.props.location.pathname.slice(-1));
    const projects = electron.remote.getGlobal("sharedObj").projects;
    const allQueries = electron.remote.getGlobal("sharedObj").queries;

    const [selectedProject] = projects
      .map(project => {
        const queries = allQueries.filter(query => {
          if (query.project_id === project.project_id) {
            return query;
          }
        });
        return { ...project, queries };
      })
      .filter(project => project.project_id === projectId);

    this.setState({ projectId, selectedProject });
  }

  componentDidUpdate(prevProps) {
    if (
      Number(prevProps.location.pathname.slice(-1)) !==
      Number(this.props.location.pathname.slice(-1))
    ) {
      const projectId = Number(this.props.location.pathname.slice(-1));
      const projects = electron.remote.getGlobal("sharedObj").projects;
      const allQueries = electron.remote.getGlobal("sharedObj").queries;

      const [selectedProject] = projects
        .map(project => {
          const queries = allQueries.filter(query => {
            if (query.project_id === project.project_id) {
              return query;
            }
          });
          return { ...project, queries };
        })
        .filter(project => project.project_id === projectId);

      this.setState({ projectId, selectedProject });
    }
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = value => {
    this.setState({ selectedValue: value, open: false });
  };

  setGlobalWithData = (sql) => {
    ipcRenderer.send("async-new-query", sql);
    electron.remote.getGlobal(
      "sharedObj"
    ).sqlQuery = sql;

  }

  render() {
    const { classes } = this.props;
    return (
      <div className="Display Column Center Width-60">
        <div className="Display Center Column Width-30 Height-50-fixed Margin-top-5 Self-align-center" >
          <div className="Column Center Display Margin-top-5 Width-60">
            <h1 className=" Grey Center Align-self-center Padding-3 ">
              {this.state.selectedProject.project_name &&
                this.state.selectedProject.project_name.toUpperCase()}
            </h1>
          </div>

          <div className="Flex-wrap Center Margin-top-5 Display Grey Height-75-fixed
          ">

            {this.state.selectedProject.queries &&
              this.state.selectedProject.queries.map(query => {
                const queryText = query.query_text
                return (

                  <div className="Height-11-fixed  lighter-background lightest-grey  effect1 Width-50 Center Column Display Border-solid Min-width-25 Query-name-box">
                    <div className="Inner-query-name-box Column Flex-wrap">
                      <div className="">
                      <Typography variant="subtitle1">
                        {query.query_name.toUpperCase()}
                      </Typography>
                      <br />
                      </div>
                    </div>
                    <div className="Row">
                    <div className=" Button Margin-buttons ">
                      <Button
                        variant="contained"
                        className={classes.button}
                        onClick={this.handleClickOpen}
                      >
                        VIEW SQL QUERY
                      </Button>
                      <SimpleDialogWrapped
                        selectedValue={queryText}
                        open={this.state.open}
                        onClose={this.handleClose}
                      />
                    </div>
                    <div
                      className="Button Margin-buttons "
                      onClick={() => this.setGlobalWithData(query.query_text)}>
                      <Button
                        variant="contained"
                        className={classes.button}
                        component={Link}
                        to="/finalizeQuery"
                      >
                        View Data
                      </Button>
                    </div>
                    </div>
                  </div>
                );
              })}

          </div>
          <div className=" Width-60">
              <Link className="No-text-decoration" to="/refineQuery">
            <div className="Margin-top-10" >
              <Icon className={classes.iconHover} color="action" style={{ fontSize: 60 }}>
                add_circle
              </Icon>
            </div>
            <div className="No-text-decoration Grey Height-50 Align-self-end  ">
              <h3 className="No-text-decoration" >CREATE QUERY</h3>
            </div>
          </Link>
              </div>
        </div>
      </div>
      // </div>
    );
  }
}

export default withStyles(styles)(Project);
