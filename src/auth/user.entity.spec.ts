import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User entity', () => {
  let user: User;
  beforeEach(() => {
    user = new User();
    user.salt = 'testSalt';
    user.password = 'testPassword';
    bcrypt.hash = jest.fn();
  });
  describe('validatePassword', () => {
    it('returns true when password is valid', async () => {
        bcrypt.hash.mockReturnValue('testPassword');
        expect(bcrypt.hash).not.toHaveBeenCalled();
        const result = await user.validatePassword('123123');
        expect(bcrypt.hash).toHaveBeenCalledWith('123123', 'testSalt');
        expect(result).toBeTruthy();
      },
    );
    it('returns true when password is invalid', async () => {
        bcrypt.hash.mockReturnValue('testPassword');
        expect(bcrypt.hash).not.toHaveBeenCalled();
        const result = await user.validatePassword('wrongPassword');
        expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
        expect(result).toBeFalsy();
      },
    );
  });
});