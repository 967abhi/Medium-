import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.get("/abhishek",(c)=>{
  return c.text("Hello abhishek kaise ho ")
})
app.post("/ramu/:name",(c)=>{
  try{
    const name=c.req.param('name');
    return c.text(`Hello ${name}`)


  }catch(err){
    console.log('Error:',err)
    return c.text("error found");
  }
})

export default app
