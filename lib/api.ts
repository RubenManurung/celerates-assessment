import type { User, RandomUserApiResponse } from "@/types/user";

export async function fetchJsonPlaceholderUsers(): Promise<User[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_JOSNPLACEHOLDER}users`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: User[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching JSONPlaceholder users:", error);
    throw error;
  }
}

export async function fetchRandomUser(): Promise<RandomUserApiResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_RANDOM_USER}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: RandomUserApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Random User:", error);
    throw error;
  }
}
