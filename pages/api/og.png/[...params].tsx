import React from 'react';
//import type { NextRequest, NextResponse } from 'next'
import { ImageResponse } from 'next/og';
import { NextRequest,NextResponse } from 'next/server';

export const size = { width: 1200, height: 600 };
export const alt = 'OpenGraph Image';
export const contentType = 'image/png';
export const runtime = 'edge';

export const config = {
    runtime: "edge",

}
/**
 * Note: the incoming session object could be only partial, will be merged over existing session
 * 
 * @param req 
 * 
 * @param res 
 * @returns 
 */
async function handler(
    req: NextRequest,
    res: NextResponse
) {
    //  console.log("req:",{method:req.method,url:req.url,query:req.query,body:req.body,headers:req.headers});

    //const threadid=req.nextUrl.searchParams.get(['threadid']);
    try {
       // console.log("START====")
      /*  const getParamsObject = (request: NextRequest) => {

        let params: any = {}; for (const [key, val] of request.nextUrl.searchParams.entries()) { params[key] = val; }
        
        return params; }*/
       // const params=getParamsObject(req);
        //console.log("req.nextUrl",req.url);
        const parts=req.url.split('?')[0].split('/');
        const height=parts[parts.length-1];
        const width=parts[parts.length-2];
        const site_name=decodeURIComponent(parts[parts.length-3]);
        const image=decodeURIComponent(parts[parts.length-4]);
       // console.log("parts:",{image,site_name,width,height});
       /* const { searchParams } = req.nextUrl;//new URL(req?.url || "");
        const image = searchParams.get('image') || '';
        const site_name = searchParams.get('site_name') || '';
        const width = +(searchParams.get('width') || '0');
        const height = +(searchParams.get('height') || '0');
        */
        
        
       //console.log({params});
       // const { image = '', site_name = '', width = 0, height = 0 } = params;
       /* const {
            query: { image, site_name,width=0,height=0 },
            method,
          } = req;*/
       // console.log("image:", image, "site_name:", site_name, "width:", width, "height:", height);
        //const query = req.query;
        //const image = query.image || "";
        //const site_name = query.site_name || "";
        //const width = +(query.width as string || "1200");
        //const height = +(query.height as string || "600");



        //console.log("threadid:",threadid);
        //console.log("tag:",tag);
        //let { threadid = '',tag=''} = req.query;
        //const key: FetchTopicKey = { threadid:threadid as string, withBody: 1, userslug: "og", sessionid: "", tag: tag as string, ackOverride: false};
        // const lakeApiUrl = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/topic/fetch?slug=${encodeURIComponent(threadid)}&withBody=${1}&userslug=${"og"}&sessionid=${"og"}&tag=${tag}`;

        // const rsp: any = await fetch(lakeApiUrl).then((res) => res.json());;
        const response = new ImageResponse(
            (
                <div style={{
                    width: +width,
                    height: +height,
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 80,
                        left: 30,
                        //right: 0,
                        height:42,// '20%', // Adjust as needed
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark background with opacity
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '10px',
                    }}>
                        <span style={{zIndex:1,fontSize:28,padding:10}} >{site_name}</span>
                    </div>
                </div>
            ),
            {
                width: +width,
                height: +height,
                emoji:'twemoji',
                
            }
        )
        return response;
    }
    catch(x) {
        //console.log("Error:",x);
        return new Response(`Failed to generate the image,${x}`, {
            status: 500,
        });
    }

}
export default handler;   