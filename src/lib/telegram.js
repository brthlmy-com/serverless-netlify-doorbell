import {fetchRequest} from './helper.js';

async function sendMessage({accessToken, chat_id, text, ...options}) {
  if (!chat_id) {
    throw new Error('Please provide chat_id');
  }
  if (!text) {
    throw new Error('Please provide text message');
  }

  try {
    const response = await fetchRequest({
      method: 'POST',
      url: `https://api.telegram.org/bot${accessToken}/sendMessage`,
      params: {
        chat_id,
        text,
        ...options,
      },
    });
    return response;
  } catch (err) {
    return err;
  }
}

export {sendMessage};
