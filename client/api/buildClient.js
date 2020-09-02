import axios from 'axios';

const buildClient = ({ req }) => {
  if (process.browser) {
    return axios.create({
      baseURL: '/', // we can leave this off
    }); // browser will take care of headers
  } else {
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  }
};

export default buildClient;
