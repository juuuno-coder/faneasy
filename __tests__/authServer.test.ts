import { loginWithMock, loginWithIdToken, signupWithAdmin } from '@/lib/authServer';

jest.mock('@/lib/firebaseAdmin', () => {
  return {
    verifyIdToken: jest.fn(async (token: string) => ({ uid: 'uid-123', email: 'mock@faneasy.kr' })),
    adminFirestore: {
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({ get: jest.fn(async () => ({ exists: true, data: () => ({ uid: 'uid-123', email: 'mock@faneasy.kr', name: 'Mock User', role: 'fan' }) }) ) ) }) )
      }),
    adminAuth: {
      createUser: jest.fn(async ({ email }) => ({ uid: 'uid-abc', email })),
      createCustomToken: jest.fn(async (uid: string) => 'custom-token-' + uid),
      getUserByEmail: jest.fn(async () => { throw new Error('not found'); }),
    }
  };
});

describe('authServer helpers', () => {
  test('loginWithMock returns influencer user when credentials match', () => {
    const res = loginWithMock('kkang@faneasy.kr', 'password123');
    expect(res).not.toBeNull();
    expect(res?.user.role).toBe('influencer');
    expect(res?.token).toBeDefined();
  });

  test('loginWithMock returns fan user when fan credentials match', () => {
    const res = loginWithMock('fan1@example.com', 'password123');
    expect(res).not.toBeNull();
    expect(res?.user.role).toBe('fan');
  });

  test('loginWithIdToken uses firebase admin to decode and returns profile', async () => {
    // ensure env var to allow path
    process.env.FIREBASE_PRIVATE_KEY = 'dummy';
    const result = await loginWithIdToken('dummy-token');
    expect(result.token).toBe('dummy-token');
    expect(result.user.email).toBe('mock@faneasy.kr');
  });

  test('signupWithAdmin creates user and returns custom token', async () => {
    process.env.FIREBASE_PRIVATE_KEY = 'dummy';
    const result = await signupWithAdmin({ email: 'new@example.com', password: 'pw', name: 'New' });
    expect(result.token).toMatch(/custom-token/);
    expect(result.user.email).toBe('new@example.com');
  });
});
