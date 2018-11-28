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
    borderRadius: 40
  },
  button: {
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit
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
        primary: "Select Data from an Additional Table",
        secondary: "(e.g. Add Customers in Addition to Orders)"
      },
      {
        primary: "Aggregate Fields",
        secondary: "(e.g. SUM, COUNT, MAX, MIN)"
      },
      {
        primary: "Filter by Field Value",
        secondary: " (e.g Order Date after 1/1/2016)"
      },
      {
        primary: "Sort by Field Value",
        secondary: "(e.g. Last Name in Ascending Order)"
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
              <Grid container spacing={16}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" className={classes.title}>
                    The following steps are optional:
                  </Typography>
                  <div className={classes.demo}>
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
                If you have the data you need, click finish to view your
                finalized query. If you would like to add another data table or
                aggregate, filter, and sort any of your selected fields, please
                click continue.
              </Typography>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleClose}
                  className={classes.button}
                >
                  Continue
                </Button>
              </div>
              <div>
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
