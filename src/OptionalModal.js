import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
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
    width: theme.spacing.unit * 100,
    height: theme.spacing.unit * 60,
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

class OptionalModal extends React.Component {
  state = {
    open: true
  };

  handleClose = () => {
    this.props.toggleOptionalModal();
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const stepNarratives = [
      {
        primary: "Select data from an additional table",
        secondary:
          "(e.g. See data from the Customers table in addition to the Orders table)"
      },
      {
        primary: "Aggregate fields",
        secondary: "(e.g. Count the number of orders for each customer)"
      },
      {
        primary: "Filter by field value",
        secondary: " (e.g See only orders with an order date after 1/1/2016)"
      },
      {
        primary: "Sort by field value",
        secondary: "(e.g. Order your customer list by last name)"
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
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" className={classes.title}>
                    The following next steps are optional:
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
              <Typography>
                If you have the data you need, click <strong>finish</strong> to
                view your finalized query.
                <br />
                If you would like to complete any of the above steps, please
                click <strong>continue.</strong>
              </Typography>
              <div className="Row-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleClose}
                  className={classes.button}
                >
                  Continue
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/finalizeQuery"
                  className={classes.button}
                >
                  Finish
                </Button>
              </div>
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

OptionalModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(OptionalModal);
