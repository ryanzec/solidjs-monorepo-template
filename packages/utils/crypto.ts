import md5 from 'spark-md5';

import { CommonDataType } from '$/types/generic';

const hashData = (data: CommonDataType) => {
  return md5.hash(JSON.stringify(data));
};

export const cryptoUtils = {
  hashData,
};
