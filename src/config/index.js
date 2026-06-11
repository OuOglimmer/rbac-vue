const env = import.meta.env.MODE || "prod";
const EnvConfig = {
  development: {
    baseApi: "/api",
    mockApi: "https://m1.apifoxmock.com/m1/8383288-8150503-default/api",
  },
  test: {
    baseApi: "/test.future.com/api",
    mockApi: "https://apifoxmock.com/m1/4068509-0-default/api",
  },
  prod: {
    baseApi: "/future.com/api",
    mockApi: "https://apifoxmock.com/m1/4068509-0-default/api",
  },
};

export default {
  env,
  mock: false,
  ...(EnvConfig[env] || EnvConfig.prod),
};