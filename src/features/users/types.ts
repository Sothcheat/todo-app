// Shape of https://jsonplaceholder.typicode.com/users (fields we use).
export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string };
  address: { street: string; suite: string; city: string; zipcode: string };
};

export const USERS_API = "https://jsonplaceholder.typicode.com/users";
