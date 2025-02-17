import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connectDB();
  const userFound = await User.findOne({ email: (await params).slug }).lean(); // Convert Mongoose object to plain JSON

  if (userFound) {
    return Response.json({ data: userFound });
  } else {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
}
