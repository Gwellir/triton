import * as http from 'http';
import * as xstate from 'xstate';
import express from 'express';
import * as bodyParser from 'body-parser';
import { connect } from '@triton/db';
import { WebHookAction } from '@triton/yclients-common';
import { createMachine } from '@triton/yclients-machine';

const createRouter = (callback: (data: WebHookAction) => void) => {
  const router = express.Router();
  router.post('/webhook', (req, res) => {
    callback(req.body);

    res.status(200).json({
      status: 'OK',
    });
  });

  return router;
};

export const start = () => {
  connect()
    .then(() => {
      const machine = createMachine();
      const service = xstate.interpret(machine);

      const port = process.env.YCLIENTS_PORT;

      const app = express();
      app.use(bodyParser.json());
      app.use(
        '/api/yclients',
        createRouter((data) => {
          service.send({
            type: 'WEB_HOOK',
            data: data,
          });
        })
      );

      const server = http.createServer(app);

      server.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
        service.start();
      });
    })
    .catch((err) => {
      console.error(err);
    });
};
