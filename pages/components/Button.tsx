import React from "react";

const Button: React.FC<{
  children: any;
}> = ({ children }) => {
  return <button>{children}</button>;
};
Button.title = "Button";

export default Button;
