import * as xstate from 'xstate';
import { createMachine } from '@triton/musbooking-machine';
import { connect } from '@triton/db';

export const start = () => {
  connect()
    .then(() => {
      const machine = createMachine();
      const service = xstate.interpret(machine);

      service.start();
    })
    .catch((err) => {
      console.error(err);
    });
};
