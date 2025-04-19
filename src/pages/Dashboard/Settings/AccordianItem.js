
import { Button, Collapse } from "reactstrap";
import classnames from "classnames";

const AccordianItem = ({
    item,
    selectedMenu,
    onChange,
  }) => {
    const isOpen =
      selectedMenu && selectedMenu === item.value ? true : false;
    const toggleCollapse = () => {
      if (isOpen) {
        onChange(null);
      } else {
        onChange(item.value);
      }
    };
    return (
      <div className="accordion-item">
        <div className="accordion-header" id="headerpersonalinfo">
          <Button
            color="none"
            className={classnames(
              "accordion-button",
              "font-size-14",
              "fw-medium",
              { collapsed: !isOpen }
            )}
            onClick={toggleCollapse}
            type="button"
          >
            <i className={classnames("text-muted", "me-3", item.icon)}></i>{" "}
            {item.label}
          </Button>
        </div>
        <Collapse
          isOpen={isOpen}
          id="personalinfo"
          className="accordion-collapse"
        >
          {item.component}
        </Collapse>
      </div>
    );
  };

export default AccordianItem;