import { Link } from "react-router-dom";
import { useCatch, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export const loader = async () => {
    const count = await db.joke.count();
    const randomRowNumber = Math.floor(Math.random() * count);
    const [randomJoke] = await db.joke.findMany({
        take: 1,
        skip: randomRowNumber
    })
    if (!randomJoke) {
        throw new Response("No random joke found", {
            status: 404
        });
    }
    const data = { randomJoke }
    return data
}

export function CatchBoundary() {
    const caught = useCatch();
  
    if (caught.status === 404) {
      return (
        <div className="error-container">
          There are no jokes to display.
        </div>
      );
    }
    throw new Error(
      `Unexpected caught response with status: ${caught.status}`
    );
  }

export default function JokesIndexRoute() {
    const data = useLoaderData()
    return (
        <div>
            <p>Here's a random joke: </p>
            <p>{data.randomJoke.content}</p>
            <Link to=".">"{data.randomJoke.name}" Permalink</Link>
        </div>
    )
}