import { Link } from "react-router-dom";

import {LogoLightSVG} from "./LogoLightSVG";
import {LogoDarkSVG} from "./LogoDarkSVG";

export const Logo = () => {
    return (
      <div className="navbar-brand-box">
        <Link to="#" className="logo logo-dark">
          <span className="logo-sm">
            <LogoLightSVG />
          </span>
        </Link>
  
        <Link to="#" className="logo logo-light">
          <span className="logo-sm">
            <LogoDarkSVG />
          </span>
        </Link>
      </div>
    );
  };