import React, { useContext, useState } from "react";
import styled from "styled-components";

import WideInput from "components/common/WideInput";
import ConfigContext from "containers/ConfigContext";
import { post } from "utils/request";

const ChatBox = ({ id }: { id: number }) => {
  const {
    config: { user_id },
  } = useContext(ConfigContext);
  const [text, setText] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
  };

  const validate = () => {
    let isError = false;
    if (!text) {
      isError = true;
    }
    return isError;
  };

  const submit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode !== 13) {
      return;
    }
    if (validate()) {
      return;
    }
    const response = await post(`/api/messages`, {
      user_id: user_id,
      conversation_id: id,
      text,
    });
    if (response.ok) {
      setText("");
    }
  };

  return (
    <Content>
      <WideInput
        key="name"
        type="text"
        value={text}
        placeholder="Message"
        onChange={handleChange}
        onKeyUp={submit}
      />
    </Content>
  );
};

const Content = styled.div`
  padding: 20px 20px 30px;
  width: 100%;

  input {
    margin-bottom: 0;
  }
`;

export default ChatBox;
