export interface Follows {
  followers: { id: string; name: string; picture?: { url: string; name: string }; bio?: string }[];
  following: { id: string; name: string; picture?: { url: string; name: string }; bio?: string }[];
}
