import { prisma } from "@repo/db";
export default async function Home() {

  const user = await prisma.user.findMany()
  return (
    
    <div>
      {user.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
