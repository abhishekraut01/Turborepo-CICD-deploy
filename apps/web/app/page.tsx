import { prisma } from "@repo/db";
export default async function Home() {

  const user = await prisma.user.findMany()
  return (
    
    <div>
      <h1>User {`=>`}  </h1>
      {user.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}


export const dynamic = 'force-dynamic'