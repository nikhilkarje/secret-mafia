import { HEADERS } from "constants/request";

export const post = async (url: string, body: Object) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      ...HEADERS,
      "X-CSRF-Token": document
        .getElementsByName("csrf-token")[0]
        .getAttribute("content"),
    },
  });
  return response;
};

export const put = async (url: string, body: Object) => {
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      ...HEADERS,
      "X-CSRF-Token": document
        .getElementsByName("csrf-token")[0]
        .getAttribute("content"),
    },
  });
  return response;
};

export const destroy = async (url: string) => {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      ...HEADERS,
      "X-CSRF-Token": document
        .getElementsByName("csrf-token")[0]
        .getAttribute("content"),
    },
  });
  return response;
};

export const get = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      ...HEADERS,
    },
  });
  return response;
};
