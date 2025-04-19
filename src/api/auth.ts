import { APIClient } from "./apiCore";
import * as url from "./urls";

const api = new APIClient();

// postForgetPwd
const postFakeForgetPwd = (data) =>
  api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// postForgetPwd
const postJwtForgetPwd = (data) =>
  api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

const postFakeLogin = (data) => api.create(url.POST_FAKE_LOGIN, data);

const postJwtLogin = (data) => api.create(url.POST_FAKE_JWT_LOGIN, data);

// Register Method
const postFakeRegister = (data) => {
  return api.create(url.POST_FAKE_REGISTER, data);
};

// Register Method
const postJwtRegister = (data) => {
  return api.create(url.JWT_REGISTER, data);
};
const changePassword = (data: object) => {
  return api.update(url.USER_CHANGE_PASSWORD, data);
};

// postSocialLogin
const postSocialLogin = (data) => api.create(url.SOCIAL_LOGIN, data);

export {
  postFakeForgetPwd,
  postJwtForgetPwd,
  postFakeLogin,
  postJwtLogin,
  postFakeRegister,
  postJwtRegister,
  changePassword,
  postSocialLogin,
};
