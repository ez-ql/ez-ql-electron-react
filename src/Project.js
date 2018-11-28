import React from "react";
// import Selector from './Selector/Selector'
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import SimpleDialogWrapped from "./QueryDialog";

import Typography from "@material-ui/core/Typography";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;
// const sharedObject = electron.remote.getGlobal('sharedObj')

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

  setGlobalWithData(sql) {
    ipcRenderer.send("async-new-query", sql);
  }

  render() {
    return (
      <div className="Display Height-50 Title Column Center Width-70">
        <div className="Display Center Height-50">
          <div className="Column ">
            <h1 className="Grey Height-20 Align-self-center Padding-3 Border-bottom">
              {this.state.selectedProject.project_name &&
                this.state.selectedProject.project_name.toUpperCase()}
            </h1>
          </div>
          <div className="Row Display Flex-wrap Grey Height-100">
            {this.state.selectedProject.queries &&
              this.state.selectedProject.queries.map(query => {
                return (
                  <div className="Width-50 Flex-wrap Height-20 Border-solid">
                    <div className="Margin-top Query-name-box">
                      <Typography variant="subtitle1">
                        {query.query_name.toUpperCase()}
                      </Typography>
                      <br />
                    </div>
                    <div className="Row">
                    <div className=" Button Margin-buttons Padding-3">
                      <Button
                        variant="contained"
                        onClick={this.handleClickOpen}
                      >
                        VIEW SQL QUERY
                      </Button>
                      <SimpleDialogWrapped
                        selectedValue={query.query_text}
                        open={this.state.open}
                        onClose={this.handleClose}
                      />
                    </div>
                    <div className=" Button Margin-buttons Padding-3">
                      <Button
                        variant="contained"
                        onClick={() => this.setGlobalWithData(query.query_text)}
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
        </div>
      </div>
      // </div>
    );
  }
}

export default Project;
