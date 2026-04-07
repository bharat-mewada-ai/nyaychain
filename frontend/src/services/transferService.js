const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const initiateTransfer = async (data) => {
  await delay(800);
  return { success: true, message: 'Transfer initiated', txnId: `TXN-${Date.now()}`, ...data };
};

export const verifyTransfer = async (data) => {
  await delay(1200);
  return { success: true, message: 'Documents and identity verified', ...data };
};

export const approveTransfer = async (data) => {
  await delay(1000);
  return { success: true, message: 'Transfer approved by registrar', ...data };
};
