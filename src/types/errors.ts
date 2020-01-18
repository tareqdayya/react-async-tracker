function generateErrorType(name: string, message: string) {
  const err = new Error();
  err.name = name;
  err.message = message;

  return err;
}

export const REQUEST_NAME_ERROR = generateErrorType(
  'REQUEST_NAME_ERROR',
  `Are You Sure You Have Sent A Request
  With Said Name? async tracker Doesn't Seem To Be Able To Find It.`
);
