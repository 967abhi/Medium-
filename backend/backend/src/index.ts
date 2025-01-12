import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
import { Payload } from '@prisma/client/runtime/library'
const app = new Hono<{
  Bindings:{
    DATABASE_URL:string
    JWT_SECRET:string
  }
}>()


//middleware in the hono 
app.use("/api/v1/blog/*",async(c,next)=>{
  //get the header
  //verify ther header
  // if the header is correct we neeed can proceed 
  // if not ,we will return user a 403
  const header = c.req.header("Authorization")||"";
  const token= header.split(" ")[1]
  //@ts-ignore
  const response = await verify(header,c.env.JWT_SECRET)
  if(response.id){
    next()
  }else{
    c.status(403);
    
    return c.json({error:"Unauthorized"})
  }
})


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

 

  const token=await  sign({id:user.id},c.env.JWT_SECRET)
return c.json({
  jwt:token
});
})
app.post("/api/v1/signin",async(c)=>{
  const prisma=new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body=await c.req.json();
    const user = await prisma.user.findFirst({
      //@ts-ignore
      where:{
        email:body.email,
        password:body.password
      }
    });
    if(!user){
      c.status(403);
      return c.json({error:"user not found"})

    }
const jwt=await sign({id:user.id},c.env.JWT_SECRET)

    return c.json({jwt});
 
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
