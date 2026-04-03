import Image from "next/image";

export default async function Home() {
  const res = await fetch("http://localhost:8000");
  const data = await res.json();

  return (
    <div>
      <h1 className="text-2xl font-bold">System healthcheck</h1>
      <p>Status: {data.status}</p>
      <p>Service: {data.service}</p>
    </div>
  );
}
