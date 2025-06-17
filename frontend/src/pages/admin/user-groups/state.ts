import { create } from 'zustand';
import { UserGroupDto } from 'src/api';

interface UserGroupssState {
  // The user groups.
  userGroups: UserGroupDto[];

  // Adds or sets an user group.
  setUserGroup: (userGroup: UserGroupDto) => void;

  // Remove an user group.
  removeUserGroup: (id: string) => void;

  // Sets all user groups.
  setUserGroups: (userGroups: UserGroupDto[]) => void;
}

const useUserGroupsStore_ = create<UserGroupssState>()((set) => ({
  userGroups: [],
  setUserGroup: (userGroup: UserGroupDto) => {
    return set((state) => {
      const userGroups = [...state.userGroups];

      const indexOfExisting = userGroups.findIndex((x) => x.id === userGroup.id);

      if (indexOfExisting >= 0) {
        userGroups[indexOfExisting] = userGroup;
      } else {
        userGroups.push(userGroup);
      }

      return { userGroups };
    });
  },
  setUserGroups: (userGroups: UserGroupDto[]) => {
    return set({ userGroups });
  },
  removeUserGroup: (id: string) => {
    return set((state) => ({ userGroups: state.userGroups.filter((x) => x.id !== id) }));
  },
}));

/**
 * @deprecated Using Zustand hooks directly in ui-components is deprecated. Use
 * other hooks to wrap the Zustand hook instead. We want hooks to have
 * interfaces that fit our domains terminology. E.g. useAIConversation exports
 * a function called sendMessage, which will talk to the LLM and update the
 * messages internally. No separate call to a Zustand hook has to be made in
 * order to update messages after using sendMessage. An ideal version of the
 * useAIConversation hook exports only actions like sendMessage and states like
 * messages, but no setters.
 **/
export const useUserGroupsStore = useUserGroupsStore_;
