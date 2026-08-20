import authReducer, { clearAuthMessages, setShowOtpModal, logout } from '../authSlice';

describe('authSlice', () => {
  const initialState = {
    token: null,
    user: null,
    registrationToken: null,
    pendingToken: null,
    isLoading: false,
    error: null,
    successMessage: null,
    pendingVerificationEmail: null,
    showOtpModal: false,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearAuthMessages', () => {
    const dirtyState = { ...initialState, error: 'error', successMessage: 'success' };
    const actual = authReducer(dirtyState, clearAuthMessages());
    expect(actual.error).toBeNull();
    expect(actual.successMessage).toBeNull();
  });

  it('should handle setShowOtpModal', () => {
    const actual = authReducer(initialState, setShowOtpModal(true));
    expect(actual.showOtpModal).toBe(true);
  });

  it('should handle logout', () => {
    const loggedInState = {
      ...initialState,
      token: '1234',
      user: { id: 1 },
      showOtpModal: true,
    };
    const actual = authReducer(loggedInState, logout());
    expect(actual).toEqual(initialState);
  });
});
