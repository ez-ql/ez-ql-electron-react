import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: 350,
    height: '100vh',
  }
};

class ButtonAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }

  }

  componentDidMount(){
    console.log('HERE in CDM')
    // ipcRenderer.send("async-project-query");
    // ipcRenderer.on("async-project-reply", (event, arg) => {
      console.log('PROJECTS ARG')

      // this.setState({
      //   project: arg
      // });
    // });
  }

  componentWillUnmount(){
    // ipcRenderer.removeAllListeners()
  }

  toggleDrawer = () => () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render(){
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
      <List>
        <ListItem key={'Database'} >
        <ListItemText  primary='Bike Stores Database' />
        </ListItem>
        {/* <ListItem button key={'List'}>
        <ListItemText primary='Project 2' />
        </ListItem> */}
      </List>
       <Divider />
       <List>
         {

         }

        <ListItem
          button
          key={'List'}
          component={Link}
          to="/project1"
        >
          <ListItemText primary='Project 1' />
        </ListItem>
        {/* <ListItem button key={'List'}>
        <ListItemText primary='Project 2' />
        </ListItem> */}
      </List>
      </div>
    );

    return (
      <div className={classes.root}>
       <Drawer
        open={this.state.open}
        onClose={this.toggleDrawer()}
      >
          <div
            className="Lightgrey"
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer()}
            onKeyDown={this.toggleDrawer()}
          >
            {sideList}
          </div>
        </Drawer>

        <AppBar position="static" >
          <Toolbar className='Light-blue' >
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.toggleDrawer()}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              color="inherit"
              className={classes.grow}
            >
              ez*ql
            </Typography>
            <Button
              color="inherit"
              component={Link}
              to="/startQuery"
            >
              Home
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
