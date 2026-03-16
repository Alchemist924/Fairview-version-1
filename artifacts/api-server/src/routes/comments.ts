import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { commentsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { AddCommentBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/:propertyId", async (req, res) => {
  const { propertyId } = req.params;

  const comments = await db
    .select({
      id: commentsTable.id,
      propertyId: commentsTable.propertyId,
      userId: commentsTable.userId,
      username: usersTable.username,
      text: commentsTable.text,
      createdAt: commentsTable.createdAt,
    })
    .from(commentsTable)
    .innerJoin(usersTable, eq(commentsTable.userId, usersTable.id))
    .where(eq(commentsTable.propertyId, propertyId))
    .orderBy(commentsTable.createdAt);

  res.json(comments.map(c => ({ ...c, createdAt: c.createdAt.toISOString() })));
});

router.post("/:propertyId", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { propertyId } = req.params;
  const parsed = AddCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [comment] = await db
    .insert(commentsTable)
    .values({ propertyId, userId, text: parsed.data.text })
    .returning();

  res.status(201).json({
    id: comment.id,
    propertyId: comment.propertyId,
    userId: comment.userId,
    username: user.username,
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
  });
});

export default router;
