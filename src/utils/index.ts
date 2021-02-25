import generateHash from 'random-hash';

export const getErrorId = error => ({ errorId: error });

const LoginPrefix = 'user';

export const GenerateRandomLogin = () =>
  `${LoginPrefix}${generateHash({ length: 10 })}`;

export const ValidateLimit = num => {
  if (!num) {
    return null;
  }

  if (num <= 0) {
    return null;
  }

  return num;
};

export const ValidateOffset = num => {
  if (!num) {
    return null;
  }

  if (num <= 0) {
    return null;
  }

  return num;
};

export const performPrice = num => Math.round(Number(num) * 100) / 100;
