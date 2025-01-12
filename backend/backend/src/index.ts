import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
import { Payload } from '@prisma/client/runtime/library'
const app = new Hono<{
  Bindings:{
    DATABASE_URL:string
  }
}>()





app.post("/api/v1/signup",async(c)=>{
  const prisma=new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body=await c.req.json();

  const user = await prisma.user.create({

    data:{
      email:body.email,
      password:body.password,
    }
  })

 

  const token= sign({id:user.id},"secret")
return c.json({
  jwt:token
});
})
app.post("/api/v1/signin",(c)=>{
  return c.text("api for sign in");
})
app.post("/api/v1/blog",(c)=>{
  return c.text("api for the blog");
})
app.put("/api/v1/blog",(c)=>{
  return c.text("api for the  put blog");
})

app.get("/api/v1/blog/:id",(c)=>{
  return c.text("api for the get blog")
})
export default app
