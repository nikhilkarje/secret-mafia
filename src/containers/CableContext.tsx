import React from "react";
import ActionCable from "actioncable";
import { API_WS_ROOT } from "constants/request";

const CableContext = React.createContext({
  cable: ActionCable.createConsumer(`${API_WS_ROOT}`),
});

export default CableContext;
