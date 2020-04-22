import React from "react";

const ConfigContext = React.createContext({
  config: (window as any).config,
});

export default ConfigContext;
