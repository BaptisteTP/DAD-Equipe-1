'use client'
import Post from "@/components/post"
import { useParams } from "next/navigation"

export default function PostPage() {
  const { postId } = useParams()
  return <Post postId={postId}/>
}