import axios from "axios";

const netgsm = axios.create({
  baseURL: "https://api.netgsm.com.tr",
});

const netgsmConf = {
  usercode: process.env.NETGSM_USERCODE,
  password: process.env.NETGSM_PASSWORD,
  appkey: "xxx",
};

export default netgsm;

export const sendSMS = async (gsmno: string, message: string) => {
  const res = await netgsm.post("/sms/send/get", null, {
    params: {
      ...netgsmConf,
      gsmno,
      message,
      msgheader: process.env.NETGSM_USERCODE,
    },
  });

  console.log(res.data);

  return res.data;
};
