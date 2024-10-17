import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="flex flex-col bg-inherit items-center justify-center min-h-screen w-full bg-gray-100 text-center"
    >
      <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! 😐🤨</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
