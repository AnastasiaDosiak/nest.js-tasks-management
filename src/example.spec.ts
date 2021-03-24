class FriendsList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    global.console.log(`${name} is a new friend`);
  }

  removeFriend(name) {
    const index = this.friends.indexOf(name);

    if (index === -1) {
      throw new Error('Friend not found!');
    }

    this.friends.splice(index, 1);
  }
}

//tests

describe('FriendsList', () => {
  let friendsList;
  let newFriendName;

  beforeEach(() => {
    friendsList = new FriendsList();
    newFriendName = 'Nastia';
  });
  it('initializes friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });
  it('adds a friend to the list', () => {
    friendsList.addFriend(newFriendName);
    expect(friendsList.friends.length).toEqual(1);
  });
  it('announces a friendship', () => {
    friendsList.announceFriendship = jest.fn();
    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend(newFriendName);
    expect(friendsList.announceFriendship).toHaveBeenCalledWith(newFriendName);
  });
  describe('removeFriend', () => {
    it('removes a friend from the list', () => {
      friendsList.addFriend(newFriendName);
      expect(friendsList.friends[0]).toEqual(newFriendName);
      friendsList.removeFriend(newFriendName);
      expect(friendsList.friends.length).toBe(0);
    });
    it('throws an error if friend does not exist', () => {
      expect(() => friendsList.removeFriend(newFriendName)).toThrow(new Error('Friend not found!'));
    });
  });
});