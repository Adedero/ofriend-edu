export interface Follows {
  followers: { id: string; name: string; picture?: { url: string; name: string }; bio?: string }[];
  following: { id: string; name: string; picture?: { url: string; name: string }; bio?: string }[];
}

export interface MentionedUser {
  id: string;
  name: string;
  picture?: { url: string, name: string }
}

export interface Post {
  textContent: string;
  status: string;
  hasText: boolean;
  hasMedia: boolean;
  mentions?: MentionedUser[];
  reposting?: boolean;
  repostedPost?: string;
}
