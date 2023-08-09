import Select, { components } from 'react-select';
export const MenuList = (props) => {
  const { MenuListHeader = null, MenuListFooter = null } =
    props.selectProps.components;

  return (
    <components.MenuList {...props}>
      {props.children.length && MenuListHeader}
      {props.children}
      {props.children.length && MenuListFooter}
    </components.MenuList>
  );
};

export const MenuListFooter = ({ showing, total, onClick }) =>
  !showing || showing >= total ? null : (
    <center>
      <button type="button" className="primary-btn" onClick={onClick}>
        Show More
      </button>
    </center>
  );
