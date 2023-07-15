import {handler} from '../src/index.js';

(async function() {
 const response = await handler({});

  console.log(response);
})();
