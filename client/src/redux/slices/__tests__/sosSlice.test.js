import sosReducer, { clearSosState, toggleAlarm, setAlarmState } from '../sosSlice';

describe('sosSlice', () => {
  const initialState = {
    activeSession: null,
    isTriggering: false,
    isResolving: false,
    isAlarmPlaying: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(sosReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle toggleAlarm', () => {
    const actual = sosReducer(initialState, toggleAlarm());
    expect(actual.isAlarmPlaying).toEqual(true);
  });

  it('should handle setAlarmState', () => {
    const actual = sosReducer(initialState, setAlarmState(true));
    expect(actual.isAlarmPlaying).toEqual(true);
  });

  it('should handle clearSosState', () => {
    const dirtyState = {
      ...initialState,
      activeSession: { id: 1 },
      isTriggering: true,
      error: 'some error',
    };
    const actual = sosReducer(dirtyState, clearSosState());
    expect(actual).toEqual(expect.objectContaining({
      activeSession: null,
      isTriggering: false,
      isResolving: false,
      error: null,
    }));
  });
});
