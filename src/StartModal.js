import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Check from "@material-ui/icons/Check";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 80,
    height: theme.spacing.unit * 28,
    backgroundColor: "white",
    padding: theme.spacing.unit * 4,
    borderRadius: 40,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    height: "40px"
  },
  title: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  grid: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});

class StartModal extends React.Component {
  state = {
    open: true
  };

  handleClose = () => {
    this.props.toggleStartModal();
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const stepNarratives = [
      {
        primary: "Selecting a table you want to see",
        secondary:
          "(e.g. Start with the customers table if you are looking for customer information)"
      },
      {
        primary: "Selecting fields from that table",
        secondary: "(e.g. Select first name, last name, and email to see data for your email campaign)"
      }
    ];
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="subtitle1" id="simple-modal-description">
              <Grid container spacing={16} className={classes.grid}>
                <Grid item xs={30} md={24}>
                  <Typography variant="h6" className={classes.title}>
                    Start your query by:
                  </Typography>
                  <div>
                    <List>
                      {stepNarratives.map(elem => {
                        return (
                          <ListItem>
                            <ListItemAvatar>
                              <Check />
                            </ListItemAvatar>
                            <ListItemText
                              primary={elem.primary}
                              secondary={elem.secondary}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </div>
                </Grid>
              </Grid>
              <div className="Row-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleClose}
                  className={classes.button}
                >
                  Continue
                </Button>
              </div>
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

StartModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(StartModal);
