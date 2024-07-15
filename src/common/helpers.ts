/**
 * @param minutes
 * @returns { code: string; expiryMin: number}
 */
export const generateExpiryCode = (minutes = 30) => ({
  code: Math.floor(1000 + Math.random() * 9000).toString(),
  expiryMin: minutes * 60 * 1000,
});

export const REDIS_KEYS = {
  FORGOT_PASSWORD_TOKEN: 'FORGOT_PASSWORD_TOKEN',
  VERIFY_EMAIL_TOKEN: 'VERIFY_EMAIL_TOKEN',
};

export const QUEUES = {
  REMINDER: {
    PROCESSOR_NAME: 'reminder',
    SEND_REMINDER_JOB: 'sendReminder',
  },
};
