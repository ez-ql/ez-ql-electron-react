import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  arrowPopper: {
    '&[x-placement*="bottom"] $arrowArrow': {
      top: 0,
      left: 0,
      marginTop: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${
          theme.palette.grey[700]
          } transparent`
      }
    }
  },
  arrowArrow: {
    position: "absolute",
    fontSize: 7,
    width: "3em",
    height: "3em",
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid"
    }
  },
  button: {
    margin: theme.spacing.unit
  },
  tooltip: {
    fontSize: 14,
    textAlign: "center"
  }
});

class FieldButtons extends React.Component {
  state = {
    arrowRef: null
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="Row-buttons Flex-Wrap">
        {this.props.fields[0] &&
          Object.keys(this.props.modFields).map(field => {
            let thisField = this.props.fields.find(
              elem => elem.field_name === field
            );
            let type =
              thisField.field_type === "varchar"
                ? "string"
                : thisField.field_type === "enum"
                  ? "custom code"
                  : thisField.field_type === "zipcode"
                    ? "zip code"
                    : thisField.field_type;
            let example =
              type === "string"
                ? `"${thisField.field_example}"`
                : thisField.field_example;
            return (
              <div>
                <Tooltip
                  title={
                    <React.Fragment>
                      {`e.g: ${example}`}
                      <br />
                      {`Type: ${type}`}
                      <span
                        className={classes.arrowArrow}
                        ref={this.handleArrowRef}
                      />
                    </React.Fragment>
                  }
                  classes={{
                    popper: classes.arrowPopper,
                    tooltip: classes.tooltip
                  }}
                  PopperProps={{
                    popperOptions: {
                      modifiers: {
                        arrow: {
                          enabled: Boolean(this.state.arrowRef),
                          element: this.state.arrowRef
                        }
                      }
                    }
                  }}
                >
                  <Button
                    className="Button"
                    type="submit"
                    name="fields"
                    value={field}
                    onClick={() => this.props.handleFieldChange(field)}
                  >
                    {this.props.modFields[field]}
                  </Button>
                </Tooltip>
              </div>
            );
          })}
        <Button
          className="Button"
          type="submit"
          name="fields"
          onClick={() => this.props.selectAll()}
        >
          SELECT ALL
        </Button>
      </div>
    );
  }
}

FieldButtons.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FieldButtons);
