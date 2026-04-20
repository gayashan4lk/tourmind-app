import Image from "next/image";

export default async function Home() {
  const res = await fetch(`${process.env.API_BASE_URL}/`);
  const data = await res.json();

  if (!data) {
    return <div>API call failed</div>;
  }

  return (
    <div>
      <h1 className="font-bold text-6xl">TourMind</h1>
      <h1 className="text-2xl font-bold">System healthcheck</h1>
      <p>Status: {data.status}</p>
      <p>Service: {data.service}</p>
    </div>
  );
}
