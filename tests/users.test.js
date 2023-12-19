const { createUser, logInUser } = require('../db/users');

test('createUser function', async () => {
  // Success case
  const successUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'ValidPassword123',
  };

  const successUser = await createUser(successUserData);

  console.log(successUser); // For debugging purposes

  // Success assertions
  expect(successUser.username).toBe('testuser');
  expect(successUser.email).toBe('test@example.com');
  expect(successUser.password).not.toBe('ValidPassword123');

  // Failure case
  const failureUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Invalidpassword',
  };

  try {
    const failureUser = await createUser(failureUserData);

    expect(failureUser).toBeNull();
  } catch (error) {
    expect(error.message).toBe('Password must contain at least one digit');
  }
});


test('logInUser function', async () => {
  // Success case
  const successUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'ValidPassword123',

  };

  const successUser = await logInUser(successUserData);

  // Success assertions
  expect(successUser.username).toBe('testuser');
  expect(successUser.email).toBe('test@example.com');
  expect(successUser.password).not.toBe('ValidPassword123');

  // Failure case
  const failureUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'InvalidPassword', // Incorrect password
  };

  try {
    const failureUser = await createUser(failureUserData);

    expect(failureUser).toBeNull();
  } catch (error) {
    expect(error.message).toBe('Password must contain at least one digit');
  }
});

