async function sha256(t){
  const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
export default {
  async fetch(req, env){
    const cors={
      "Access-Control-Allow-Origin": env.ALLOW_ORIGIN||"*",
      "Access-Control-Allow-Methods":"GET,PUT,OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type,X-Pin",
      "Content-Type":"application/json"
    };
    if(req.method==="OPTIONS") return new Response(null,{headers:cors});
    const url=new URL(req.url);
    if(url.pathname!=="/sync") return new Response('{"error":"not found"}',{status:404,headers:cors});
    const pin=req.headers.get("X-Pin")||"";
    if(!/^\d{4,12}$/.test(pin)) return new Response('{"error":"bad pin"}',{status:400,headers:cors});
    const k="p:"+await sha256(pin);
    if(req.method==="GET"){
      const v=await env.MATJIP_SYNC.get(k);
      return new Response(v||"{}",{headers:cors});
    }
    if(req.method==="PUT"){
      const body=await req.text();
      if(body.length>200000) return new Response('{"error":"too large"}',{status:413,headers:cors});
      try{ const o=JSON.parse(body); if(typeof o!=="object"||Array.isArray(o)) throw 0; }
      catch(e){ return new Response('{"error":"bad json"}',{status:400,headers:cors}); }
      await env.MATJIP_SYNC.put(k,body);
      return new Response('{"ok":true}',{headers:cors});
    }
    return new Response('{"error":"method"}',{status:405,headers:cors});
  }
};
